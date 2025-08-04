import { AUCTION_STATUS } from '@/shared/consts/auctionStatus';
import getUserId from '@/shared/lib/getUserId';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { productId } = await request.json();
  const { error } = await supabase.from('product').delete().eq('product_id', productId);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ success: false, message: '로그인 필요' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') ?? 'all';

  const { data, error } = await supabase
    .from('product')
    .select(
      `
      *,
      product_image:product_image!product_image_product_id_fkey(*),
      auction:auction!auction_product_id_fkey(
        *,
        bid_history:BidHistory_auction_id_fkey(*)
      )
    `
    )
    .eq('exhibit_user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return NextResponse.json(
      { success: false, message: '출품 데이터 로딩 실패', error },
      { status: 500 }
    );
  }

  const filtered = data.filter((product) => {
    const auction = Array.isArray(product.auction) ? product.auction[0] : product.auction;
    if (!auction || product.latitude == null || product.longitude == null) return false;

    switch (filter) {
      case 'pending':
        return auction.auction_status === AUCTION_STATUS.PENDING;
      case 'progress':
        return auction.auction_status === AUCTION_STATUS.IN_PROGRESS;
      case 'win':
        return auction.auction_status === AUCTION_STATUS.ENDED && !!auction.winning_bid_user_id;
      case 'fail':
        return auction.auction_status === AUCTION_STATUS.ENDED && !auction.winning_bid_user_id;
      case 'all':
      default:
        return true;
    }
  });

  return NextResponse.json({ success: true, data: filtered });
}
