import { sendNotification } from '@/app/actions';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const proposalId = await req.json();

  try {
    const { data, error } = await supabase
      .from('proposal')
      .select(
        `
        id,
        proposer_id ( nickname ),
        auction (
          product (
            title,
            product_image (
              image_url
            )
          )
        ),
        chat_room (
          chatroom_id
        )
      `
      )
      .eq('id', proposalId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: '데이터 조회 실패' }, { status: 500 });
    }
    const payload = {
      nickname: data.proposer_id?.nickname,
      productName: data.auction[0]?.product?.title,
      chatroomId: data.chat_room[0]?.chatroom_id,
      image: data.auction[0]?.product[0]?.product_image?.image_url,
    };

    await sendNotification(`${proposalId.user_id}`, 'auction', 'proposalAccepted', payload);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
