import { NextRequest, NextResponse } from 'next/server';
import { sendNotification } from '@/app/actions';
import { createClient } from '@/shared/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const proposalValue = await req.json();

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
        )
      `
      )
      .eq('id', proposalValue.proposalId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: '데이터 조회 실패' }, { status: 500 });
    }

    const payload = {
      nickname: data.proposer_id[0]?.nickname,
      productName: data.auction[0]?.product[0]?.title,
      price: proposalValue.price,
      image: data.auction[0]?.product[0]?.product_image?.[0]?.image_url,
    };

    await sendNotification(`${proposalValue.user_id}`, 'auction', 'proposalRequest', payload);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
