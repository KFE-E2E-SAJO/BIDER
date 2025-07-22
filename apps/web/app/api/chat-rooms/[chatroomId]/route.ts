import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';

export async function GET(request: NextRequest, { params }: { params: { chatroomId: string } }) {
  const searchParams = new URL(request.url).searchParams;
  const chatroomIdFromQuery = searchParams.get('chatroomId');
  const userId = request.headers.get('x-user-id');

  // 2. 동적 라우트 파라미터 추출
  const chatroomIdFromParams = params.chatroomId;

  // 3. 우선순위에 따라 chatroomId 결정 (쿼리 → 파라미터 → undefined)
  const chatroomId = chatroomIdFromQuery || chatroomIdFromParams;

  if (!chatroomId || typeof chatroomId !== 'string' || chatroomId === 'null') {
    return NextResponse.json({ error: 'chatroom_id는 필수입니다.' }, { status: 400 });
  }

  // 1. 채팅방 목록
  const { data: chatRooms, error: chatRoomError } = await supabase
    .from('chat_room')
    .select('*')
    .or(`exhibit_user_id.eq.${userId},bid_user_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (chatRoomError) throw new Error(chatRoomError.message);

  // 2. 메시지 가져오기
  const { data, error: msgError } = await supabase
    .from('message')
    .select('*')
    .eq('chatroom_id', chatroomId);
  if (msgError) {
    console.error('Supabase message error:', msgError);
    return NextResponse.json({ error: msgError.message }, { status: 500 });
  }
  // 3. auction 정보
  const auctionIds = chatRooms.map((room) => room.auction_id);
  // 쿼리 오타 주의: chat_rooom → chat_room, 그리고 auction은 별도의 테이블에서!
  const { data: auctions, error: auctionError } = await supabase
    .from('auction')
    .select('auction_id, min_price, product_id')
    .in('auction_id', auctionIds);

  if (auctionError) throw new Error(auctionError.message);

  // 4. product 정보
  const productIds = auctions.map((a) => a.product_id);
  const { data: products, error: productError } = await supabase
    .from('product')
    .select('product_id, title, profiles:exhibit_user_id (user_id, nickname, profile_img)')
    .in('product_id', productIds);
  if (productError) throw new Error(productError.message);

  // 5. product_image 정보
  const { data: productImages, error: imageError } = await supabase
    .from('product_image')
    .select('product_id, image_url, order_index')
    .in('product_id', productIds)
    .eq('order_index', 0);
  if (imageError) throw new Error(imageError.message);

  // === 데이터 조립 ===
  // Map으로 조립 (빠른 lookup)
  const auctionMap = Object.fromEntries(auctions.map((a) => [a.auction_id, a]));
  const productMap = Object.fromEntries(products.map((p) => [p.product_id, p]));
  const imageMap = productImages.reduce((acc: Record<string, any[]>, img) => {
    (acc[img.product_id] = acc[img.product_id] || []).push(img);
    return acc;
  }, {});

  const messages = (data ?? [])
    .map((msg: any) => ({
      ...msg,
      // sender_id가 객체로 확장되었으므로 실제 user_id 추출
      sender_user_id: msg.sender_id?.user_id || null,
      sender_nickname: msg.sender_id?.nickname || '익명',
      sender_profile_img: msg.sender_id?.profile_img || '/default-profile.png',
    }))
    .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const latestMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const unreadCount = userId
    ? messages.filter((msg: any) => !msg.is_read && msg.sender_user_id !== userId).length
    : 0;

  // 필요한 정보를 한 객체에 묶어서 반환
  const response = {
    chatRooms, // 내 채팅방 목록
    auctions, // 채팅방의 auction 정보
    products, // 상품 정보
    productImages, // 상품 이미지 정보
    // + 필요한 경우 아래처럼 조립해서 추가
    chatRoomsDetail: chatRooms.map((room) => {
      const auction = auctionMap[room.auction_id] || {};
      const product = productMap[auction.product_id] || {};
      const images = imageMap[auction.product_id] || [];
      const product_image_url =
        images.find((img) => img.order_index === 0)?.image_url || '/default-profile.png';
      return {
        chatroom_id: room.chatroom_id,
        auction_id: room.auction_id,
        min_price: auction.min_price ?? null,
        title: product.title ?? null,
        product_image_url,
        updated_at: room.updated_at,
        messages,
        latestMessage,
        unreadCount,
      };
    }),
  };

  return NextResponse.json(response);
}

export async function POST(req: NextRequest, { params }: { params: { chatroomId: string } }) {
  try {
    // 1. 요청 본문에서 데이터 추출
    const body = await req.json();
    const { content, userId } = body;
    const chatroom_id = params.chatroomId;

    // 2. 필수 파라미터 검증
    if (!content || !chatroom_id || !userId) {
      return NextResponse.json(
        { error: 'content, chatroom_id, userId는 필수입니다.' },
        { status: 400 }
      );
    }

    // 3. 세션 확인 (선택사항 - 보안을 위해)
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError) {
      return NextResponse.json(
        { error: 'Authentication error: ' + authError.message },
        { status: 401 }
      );
    }

    // 4. 메시지 삽입
    const { data, error: sendMessageError } = await supabase
      .from('message')
      .insert({
        content,
        sender_id: userId,
        chatroom_id,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select();

    // 5. 에러 처리
    if (sendMessageError) {
      console.error('Message send error:', sendMessageError);
      return NextResponse.json({ error: sendMessageError.message }, { status: 500 });
    }

    // 6. 성공 응답
    return NextResponse.json({ message: 'Message sent successfully', data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/chat-rooms/[chatroomId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
