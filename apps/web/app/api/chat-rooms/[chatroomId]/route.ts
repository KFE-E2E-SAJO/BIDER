import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';

// GET: 채팅방 상세+관련정보+메시지
export async function GET(request: NextRequest, { params }: { params: { chatroomId: string } }) {
  const searchParams = new URL(request.url).searchParams;
  const chatroomIdFromQuery = searchParams.get('chatroomId');
  const userId = request.headers.get('x-user-id');
  const chatroomIdFromParams = params.chatroomId;
  const chatroomId = chatroomIdFromQuery || chatroomIdFromParams;

  if (!chatroomId || typeof chatroomId !== 'string' || chatroomId === 'null') {
    return NextResponse.json({ error: 'chatroom_id는 필수입니다.' }, { status: 400 });
  }

  // 1. 채팅방 디테일 정보 쿼리
  const { data: chatRoomData, error: chatRoomError } = await supabase
    .from('chat_room')
    .select(
      `
        chatroom_id,
        auction_id,
        updated_at,
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
        exhibit_profile:exhibit_user_id (
          user_id,
          nickname,
          profile_img
        ),
        bid_profile:bid_user_id (
          user_id,
          nickname,
          profile_img
        )
      `
    )
    .eq('chatroom_id', chatroomId)
    .maybeSingle();

  if (chatRoomError) {
    return NextResponse.json({ error: chatRoomError.message }, { status: 500 });
  }
  if (!chatRoomData) {
    return NextResponse.json({ error: '채팅방을 찾을 수 없습니다.' }, { status: 404 });
  }

  // 2. 메시지 쿼리 (이 방의 모든 메시지)
  const { data: messages, error: msgError } = await supabase
    .from('message')
    .select(
      `
        message_id,
        content,
        created_at,
        is_read,
        sender_id,
        profile:sender_id (
          user_id,
          nickname,
          profile_img
        )
      `
    )
    .eq('chatroom_id', chatroomId)
    .order('created_at', { ascending: true });
  if (msgError) {
    return NextResponse.json({ error: msgError.message }, { status: 500 });
  }

  // 최신 메시지/안읽은 개수
  const latestMessage = messages?.[messages.length - 1] || null;
  const unreadCount =
    userId && messages
      ? messages.filter((msg: any) => !msg.is_read && msg.sender_id !== userId).length
      : 0;

  // 대표 이미지(order_index==0)
  const productImages = (chatRoomData?.auction as any)?.product?.product_image || [];
  const product_image_url =
    productImages.find((img: any) => img.order_index === 0)?.image_url || '/default-profile.png';

  // 채팅방 상세 조립
  const response = {
    chatroom_id: chatRoomData.chatroom_id,
    min_price: (chatRoomData?.auction as any)?.min_price ?? null,
    title: (chatRoomData?.auction as any)?.product?.title ?? null,
    product_image_url,
    buyer: {
      user_id: (chatRoomData?.exhibit_profile as any)?.user_id ?? null,
      nickname: (chatRoomData?.exhibit_profile as any)?.nickname ?? '알수없음',
      profile_img: (chatRoomData?.exhibit_profile as any)?.profile_img ?? '/default-profile.png',
    },
    seller: {
      user_id: (chatRoomData?.bid_profile as any)?.user_id ?? null,
      nickname: (chatRoomData?.bid_profile as any)?.nickname ?? '알수없음',
      profile_img: (chatRoomData?.bid_profile as any)?.profile_img ?? '/default-profile.png',
    },
    messages: messages?.map((msg: any) => ({
      message_id: msg.message_id,
      content: msg.content,
      created_at: msg.created_at,
      is_read: msg.is_read,
      sender: {
        user_id: msg.profile?.user_id ?? msg.sender_id,
        nickname: msg.profile?.nickname ?? '익명',
        profile_img: msg.profile?.profile_img ?? '/default-profile.png',
      },
    })),
    latestMessage,
    unreadCount,
    updated_at: chatRoomData.updated_at,
  };

  return NextResponse.json(response);
}

// POST: 메시지 전송
export async function POST(req: NextRequest, { params }: { params: { chatroomId: string } }) {
  try {
    const body = await req.json();
    const { content, userId } = body;
    const chatroom_id = params.chatroomId;
    if (!content || !chatroom_id || !userId) {
      return NextResponse.json(
        { error: 'content, chatroom_id, userId는 필수입니다.' },
        { status: 400 }
      );
    }
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

    if (sendMessageError) {
      console.error('Message send error:', sendMessageError);
      return NextResponse.json({ error: sendMessageError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Message sent successfully', data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/chat-rooms/[chatroomId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
