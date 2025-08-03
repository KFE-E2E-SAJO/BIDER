import { sendNotification } from '@/app/actions';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const proposalValue = await req.json();

  console.log('--------proposalValue:', proposalValue, '--------');

  try {
    const { data, error } = await supabase
      .from('proposal')
      .select(
        `
          proposal_id,
          proposer:proposer_id (
            nickname
          ),
          auction:auction_id (
            product:product_id (
              title,
              product_image (
                image_url
              )
            )
          )
        `
      )
      .eq('proposal_id', proposalValue.proposalId)
      .single();

    console.log('------data', data, '--------');

    if (error || !data) {
      return NextResponse.json({ error: '데이터 조회 실패' }, { status: 500 });
    }
    const payload = {
      nickname: data.proposer[0]?.nickname,
      productName: data.auction[0]?.product?.title,
      image: data.auction[0]?.product?.product_image?.[0]?.image_url ?? null,
      // chatroomId: chatRoomRes.data?.chatroom_id ?? null,
    };

    console.log('payload: ', payload);

    await sendNotification(`${proposalValue.user_id}`, 'auction', 'proposalAccepted', payload);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
