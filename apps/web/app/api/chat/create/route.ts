import { decodeShortId, encodeUUID } from '@/shared/lib/shortUuid';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { auction, exhibitUser, bidUser } = body;

  const auctionId = decodeShortId(auction);
  const exhibitUserId = decodeShortId(exhibitUser);
  const bidUserId = decodeShortId(bidUser);

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
