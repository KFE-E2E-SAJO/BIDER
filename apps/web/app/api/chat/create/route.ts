import { decodeShortId, encodeUUID } from '@/shared/lib/shortUuid';
import { createClient } from '@/shared/lib/supabase/server';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { auction, exhibitUser, bidUser } = body;

  const auctionId = decodeShortId(auction);
  const exhibitUserId = decodeShortId(exhibitUser);
  let bidUserId = '';
  if (bidUser === 'loginUser') {
    const authSupabase = await createClient();

    const {
      data: { session },
    } = await authSupabase.auth.getSession();
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    bidUserId = userId;
  } else {
    bidUserId = decodeShortId(bidUser);
  }

  const { data, error } = await supabase
    .from('chat_room')
    .insert([
      {
        auction_id: auctionId,
        bid_user_id: bidUserId,
        exhibit_user_id: exhibitUserId,
      },
    ])
    .select('chatroom_id')
    .single();

  if (error) {
    console.error(error.message);
    return NextResponse.json(
      { success: false, message: '채팅방 생성 실패', error },
      { status: 500 }
    );
  }

  const encodedChatRoomId = data ? encodeUUID(data.chatroom_id) : null;
  return NextResponse.json({ encodedChatRoomId });
}
