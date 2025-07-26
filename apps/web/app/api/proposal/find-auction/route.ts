import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import shortUUID from 'short-uuid';

const translator = shortUUID();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const shortId = searchParams.get('shortId');

  if (!userId || !shortId) {
    return NextResponse.json(
      { success: false, message: '요청 정보가 부족합니다.' },
      { status: 400 }
    );
  }

  const auctionId = translator.toUUID(shortId);

  const { data, error } = await supabase
    .from('auction')
    .select(
      `
      auction_id,
      product_id,
      min_price,
      product:product_id(
        *,
        product_image:product_image!product_image_product_id_fkey(*)
      ),
       bid_history!auction_id(bid_price)
    `
    )
    .eq('auction_id', auctionId)
    .single();

  // .from('proposal')
  // .select(
  //   `
  //     *,
  //     auction:proposal_auction_id_fkey(
  //       *,
  //       product:product_id(
  //         *,
  //         product_image:product_image!product_image_product_id_fkey(*)
  //       )
  //     ),
  //     proposer_id:proposal_proposer_id_fkey(*)
  //   `
  // )
  // .eq("auction_id", auctionId)
  // .order("created_at", { ascending: false });

  if (error || !data) {
    return NextResponse.json(
      { success: false, message: '상품 불러오기 실패', error },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: data });
}
