import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { chatroomId, exhibitUserId, bidUserId, imgUrl, price, title } = body;

  const { data, error } = await supabase
    .from('system_message')
    .insert([
      {
        chatroom_id: chatroomId,
        bid_user_id: bidUserId,
        exhibit_user_id: exhibitUserId,
        product_image_url: imgUrl,
        bid_price: price,
        product_title: title,
      },
    ])
    .select('system_message_id')
    .single();

  if (error) {
    console.error(error.message);
    return NextResponse.json(
      { success: false, message: '시스템 메세지 생성 실패', error },
      { status: 500 }
    );
  }

  const systemMessageId = data ? data.system_message_id : null;
  return NextResponse.json({ systemMessageId });
}
