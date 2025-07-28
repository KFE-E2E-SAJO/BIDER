import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const proposalId = searchParams.get('proposalId');

  if (!userId || !proposalId) {
    return NextResponse.json(
      { success: false, message: '요청 정보가 부족합니다.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('proposal')
    .select(
      `
      *,
      auction:proposal_auction_id_fkey(
        auction_id,
        min_price,
        bid_history!auction_id(bid_price),
        product:product_id(
          product_id,
          title,
          product_image:product_image!product_image_product_id_fkey(image_url),
            exhibit_user_id
          )
        ),
      proposer_id:proposal_proposer_id_fkey(nickname, profile_img, user_id)    
    `
    )
    .eq('proposal_id', proposalId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, message: '상품 불러오기 실패', error },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: data });
}
