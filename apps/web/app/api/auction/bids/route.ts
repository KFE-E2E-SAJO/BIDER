import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('bid_history')
    .select(
      `
        *,
        auction:auction_id(
          *,
          product:product_id(
            *,
            product_image:product_image!product_image_product_id_fkey(*)
          )
        )
      `
    )
    .eq('bid_user_id', userId)
    .order('bid_at', { ascending: false });

  if (error || !data) {
    console.error('출품 데이터 로딩 실패:', error);
    return NextResponse.json(
      { success: false, message: '데이터 로딩 실패', error },
      { status: 500 }
    );
  }

  const uniqueByAuction = new Map();
  for (const bid of data) {
    if (!uniqueByAuction.has(bid.auction_id)) {
      uniqueByAuction.set(bid.auction_id, bid);
    }
  }

  const deduplicated = Array.from(uniqueByAuction.values());
  const auctionIds = deduplicated.map((item) => item.auction_id);

  const { data: stats, error: statsError } = await supabase
    .from('bid_history')
    .select('auction_id, bid_price')
    .in('auction_id', auctionIds);

  if (statsError) {
    console.error('bid count fetch error:', statsError);
    return NextResponse.json(
      { success: false, message: 'bid count error', error: statsError },
      { status: 500 }
    );
  }

  const bidCountMap: Record<string, number> = {};
  const maxPriceMap: Record<string, number> = {};

  for (const item of stats ?? []) {
    const auctionId = item.auction_id;
    const price = Number(item.bid_price);
    bidCountMap[auctionId] = (bidCountMap[auctionId] ?? 0) + 1;
    maxPriceMap[auctionId] = Math.max(maxPriceMap[auctionId] ?? 0, price);
  }

  const enriched = deduplicated.map((item) => ({
    ...item,
    bidCount: bidCountMap[item.auction_id] ?? 0,
    maxPrice: maxPriceMap[item.auction_id] ?? item.auction?.min_price ?? 0,
  }));

  return NextResponse.json({ success: true, data: enriched });
}
