import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';

export async function GET(req: NextRequest, { params }: { params: { chatroomId: string } }) {
  const DEFAULT_PROFILE_IMG = '/default-profile.png';

  // 1. URL 파라미터에서 chatroomId 추출
  const chatroom_id = params.chatroomId;

  // 2. 쿼리 파라미터에서 userId 추출 (선택적)
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  console.log('API called with:', { chatroom_id, userId });

  if (!chatroom_id) {
    return NextResponse.json({ error: 'chatroomId is required' }, { status: 400 });
  }
  try {
    // 3. 통합 데이터 쿼리
    const { data, error } = await supabase
      .from('chat_room')
      .select(
        `
    chatroom_id,
    bid_user_id,
    auction_id,
    auction:auction_id (
      min_price,
      product_id,
      product:product_id (
        title,
        product_image (
          image_url,
          order_index
        )
      )
    ),
    message:message (
      message_id,
      content,
      created_at,
      sender_id,
      profile:sender_id (
        nickname,
        profile_img
      )
    )
  `
      )
      .eq('chatroom_id', chatroom_id)
      .single(); // maybeSingle() 대신 single() 사용

    console.log('Database query result:', { data, error });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Chat room not found' }, { status: 404 });
    }

    // 4. 메시지 정렬 및 사용자 정보 매핑
    const messages = (data.message ?? [])
      .map((msg: any) => ({
        ...msg,
        // sender_id가 객체로 확장되었으므로 실제 user_id 추출
        sender_user_id: msg.sender_id?.user_id || null,
        sender_nickname: msg.sender_id?.nickname || '익명',
        sender_profile_img: msg.sender_id?.profile_img || DEFAULT_PROFILE_IMG,
      }))
      .sort(
        (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

    const latestMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    const unreadCount = userId
      ? messages.filter((msg: any) => !msg.is_read && msg.sender_user_id !== userId).length
      : 0;

    const result = {
      chatroom_id: data.chatroom_id,
      min_price: data.auction_id?.min_price ?? 0,
      title: data.auction_id?.product_id?.title ?? '알수없음',
      product_image_url:
        data.auction_id?.product_id?.product_image?.image_url ?? DEFAULT_PROFILE_IMG,
      messages,
      latestMessage,
      unreadCount,
      bid_user: {
        user_id: data.bid_user_id?.user_id ?? '',
        nickname: data.bid_user_id?.nickname ?? '익명',
        profile_img: data.bid_user_id?.profile_img ?? DEFAULT_PROFILE_IMG,
      },
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
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
