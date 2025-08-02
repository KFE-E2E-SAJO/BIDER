import { decodeShortId, encodeUUID } from '@/shared/lib/shortUuid';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { auctionId, exhibitUserId, bidUserId } = await request.json();
    const auctionFullId = decodeShortId(auctionId);
    const exhibitUserFullId = decodeShortId(exhibitUserId);
    const bidUserFullId = decodeShortId(bidUserId);

    const { data, error } = await supabase
      .from('chat_room')
      .select('chatroom_id')
      .eq('auction_id', auctionFullId)
      .eq('exhibit_user_id', exhibitUserFullId)
      .eq('bid_user_id', bidUserFullId)
      .eq('exhibit_user_active', true)
      .eq('bid_user_active', true)
      .maybeSingle();

    if (error) {
      throw new Error(`chat_room 존재 여부 조회 실패: ${error.message}`);
    }

    const encodedChatRoomId = data ? encodeUUID(data.chatroom_id) : null;

    return NextResponse.json({ encodedChatRoomId });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
