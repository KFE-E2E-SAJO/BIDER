import { NextRequest, NextResponse } from 'next/server';
import { sendNotification } from '@/app/actions';
import { createClient } from '@/shared/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const proposalValue = await req.json();

  try {
    // 닉네임 조회(제안자)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('user_id', proposalValue.user_id);

    const nickname = profileData?.[0]?.nickname;

    // 상품 정보 조회
    const { data: auctionData, error: auctionError } = await supabase
      .from('auction')
      .select(
        `
        product (
          title,
          exhibit_user_id,
          product_image (
            image_url
          )
        )
        `
      )
      .eq('auction_id', proposalValue.auctionId)
      .single();

    const productInfo = auctionData?.product;

    const payload = {
      nickname: nickname,
      productName: productInfo?.title,
      image: productInfo?.product_image?.image_url,
      price: proposalValue.price,
    };

    await sendNotification(
      `${productInfo?.exhibit_user_id}`,
      'auction',
      'proposalRequest',
      payload
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
