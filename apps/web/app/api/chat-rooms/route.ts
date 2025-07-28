import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';
import { create, update } from 'lodash';
import { ChatRoomWithProfile } from '@/entities/chatRoom/model/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    // 1. 챗룸+프로덕트+프로필 한 번에 가져오기 (조인)
    const { data: chatRooms, error: chatRoomError } = await supabase
      .from('chat_room')
      .select(
        `
        chatroom_id,
        updated_at,
        auction:auction_id (
          product:product_id (
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
      .or(`exhibit_user_id.eq.${userId},bid_user_id.eq.${userId}`)
      .order('updated_at', { ascending: false });
    if (chatRoomError) throw new Error('Supabase 쿼리 실패: ' + chatRoomError.message);
    const chatRoomIds = chatRooms.map((room) => room.chatroom_id);

    // 2. 메시지(최신 1개) 모두 쿼리 (각 채팅방별로 한 개씩)
    // (Supabase group-by가 안되니 JS로 뽑음)
    const { data: allMessages, error: msgError } = await supabase
      .from('message')
      .select('message_id, chatroom_id, content, created_at, sender_id, is_read')
      .in('chatroom_id', chatRoomIds);
    if (msgError) throw new Error('메시지 쿼리 실패: ' + msgError.message);

    // 최신 메시지 map (chatroom_id별 1개, 최신순)
    const latestMsgMap = new Map();
    (allMessages ?? [])
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .forEach((msg) => {
        if (!latestMsgMap.has(msg.chatroom_id)) {
          latestMsgMap.set(msg.chatroom_id, msg);
        }
      });

    // 안읽은 개수 map
    const unreadCountMap: Record<string, number> = {};
    chatRoomIds.forEach((id) => {
      const unread = (allMessages ?? []).filter(
        (msg) => msg.chatroom_id === id && !msg.is_read && msg.sender_id !== userId
      ).length;
      unreadCountMap[id] = unread;
    });

    // 3. 안읽은 메시지 읽음처리
    await supabase
      .from('message')
      .update({ is_read: true })
      .in('chatroom_id', chatRoomIds)
      .eq('is_read', false)
      .neq('sender_id', userId);

    // 4. 최종 데이터 가공 (채팅방별 대표이미지, 프로필, 최신메시지 등)
    const result = chatRooms.map((room: any) => {
      const productImages = room.auction?.product?.product_image ?? [];
      const mainImage = productImages.find((img: any) => img.order_index === 0);
      const product_image_url = mainImage ? mainImage.image_url : '/default-profile.png';
      // 대표 이미지
      console.log('room:', room.auction);
      // 판매자/구매자 닉네임/프로필
      const buyer = room.exhibit_profile ?? {};
      const seller = room.bid_profile ?? {};

      // 최신 메시지/안읽은 개수
      const latestMessage = latestMsgMap.get(room.chatroom_id) || null;
      const unread = unreadCountMap[room.chatroom_id] ?? 0;

      return {
        chatroom_id: room.chatroom_id,
        product_image_url,
        buyer: {
          user_id: (buyer as any)?.user_id ?? null,
          nickname: (buyer as any)?.nickname,
          profile_img: (buyer as any)?.profile_img ?? '/default-profile.png',
        },
        seller: {
          user_id: (seller as any)?.user_id ?? null,
          nickname: (seller as any)?.nickname,
          profile_img: (seller as any)?.profile_img ?? '/default-profile.png',
        },
        latestMessage,
        unread,
        updated_at: room.updated_at,
        created_at: latestMessage ? latestMessage.created_at : room.updated_at,
      };
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error('채팅방 리스트 API 500 오류:', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { auction_id, exhibit_user_id, bid_user_id } = await req.json();

  // 1. 이미 존재하는 채팅방 있는지 조회 (auction_id, bid_user_id 기준)
  const { data: rooms, error: selectError } = await supabase
    .from('chat_room')
    .select('*')
    .eq('auction_id', auction_id)
    .or(
      `and(bid_user_id.eq.${bid_user_id},exhibit_user_id.eq.${exhibit_user_id}),` +
        `and(bid_user_id.eq.${exhibit_user_id},exhibit_user_id.eq.${bid_user_id})`
    );
  console.log('rooms:', rooms);
  if (selectError) {
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }

  if (rooms && rooms.length > 0) {
    // 이미 채팅방 있으면 반환
    return NextResponse.json({ chatRoomId: rooms[0].chatroom_id }, { status: 200 });
  }

  // 2. 없으면 새로 생성 (exhibit_user_id, bid_user_id, auction_id 지정)
  const { data: newRoom, error: insertError } = await supabase
    .from('chat_room')
    .insert([
      {
        auction_id,
        exhibit_user_id,
        bid_user_id,
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ chatRoomId: newRoom.chatroom_id }, { status: 201 });
}
