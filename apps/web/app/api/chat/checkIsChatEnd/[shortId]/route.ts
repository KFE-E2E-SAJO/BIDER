import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';
import { decodeShortId } from '@/shared/lib/shortUuid';

export async function GET(_req: Request, { params }: { params: Promise<{ shortId: string }> }) {
  const resolvedParams = await params;
  const chatRoomId = decodeShortId(resolvedParams.shortId);

  if (!chatRoomId) {
    return NextResponse.json({ error: 'chatRoomId is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('chat_room')
    .select('exhibit_user_active, bid_user_active')
    .eq('chatroom_id', chatRoomId)
    .limit(1)
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const isChatEnd = !(data?.bid_user_active && data?.exhibit_user_active);

  return NextResponse.json({ isChatEnd });
}
