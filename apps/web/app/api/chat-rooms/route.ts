import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  console.log('userId:', userId);
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }
  const message = supabase.channel('message');

  try {
    // 1. 통합 쿼리 한 번!
    const { data: chatRooms, error } = await supabase
      .from('chat_room')
      .select(
        `
      *,
      auction_id (
        min_price,
        product_id,
        product:product_id (
          title,
          product_image (
            image_url
          )
        )
      ),
      message (
        message_id, content, created_at, sender_id, is_read
      ),
      exhibit_user_id (
        user_id,
        nickname,
        profile_img
      )
    `
      )
      .or(`exhibit_user_id.eq.${userId},bid_user_id.eq.${userId}`)
      .order('updated_at', { ascending: false });
    if (error) {
      throw new Error('Supabase 쿼리 실패: ' + error.message);
    }

    // 2. 프론트에서 가공해서 필요한 정보만 골라주기
    const data = (chatRooms ?? []).map((room) => {
      // 대표 이미지 (여러 개일 땐 0번 index, 아니면 default)
      const productImages = room.auction_id?.product_id?.product_image ?? [];
      const product_image_url =
        productImages.length > 0 ? productImages[0].image_url : '/default-profile.png';
      // 최신 메시지(미리보기)
      const messages = (room.message ?? []).sort(
        (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      const latestMessage = messages.length > 0 ? messages[messages.length - 1] : null;
      // 안읽은 메시지 수
      const unread = messages.filter((msg: any) => !msg.is_read && msg.sender_id !== userId).length;

      return {
        chatroom_id: room.chatroom_id,
        product_image_url,
        nickname: room.exhibit_user_id?.nickname ?? '알수없음',
        profile_img: room.exhibit_user_id?.profile_img ?? '/default-profile.png',
        latestMessage,
        unread,
        updated_at: room.updated_at,
      };
    });
    return NextResponse.json(data);
  } catch (e) {
    console.error('채팅방 리스트 API 500 오류:', e);

    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
