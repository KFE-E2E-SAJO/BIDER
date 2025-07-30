import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';
import { searcher } from '@/features/search/lib/utils';
import { getDistanceKm } from '@/features/product/lib/utils';
import { AuctionList } from '@/entities/auction/model/types';
import { AuctionListResponse } from '@/features/auction/list/types';
import getUserId from '@/shared/lib/getUserId';

interface ErrorResponse {
  error: string;
  code?: string;
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<AuctionListResponse | ErrorResponse>> {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get('search')!;
  const cate = searchParams.get('cate');
  const sort = searchParams.get('sort');
  const filters = searchParams.getAll('filter');
  const hasDeadlineToday = filters.includes('deadline-today');
  const hasExcludeEnded = filters.includes('exclude-ended');
  const userId = await getUserId();
  if (!userId || userId === 'undefined') {
    return NextResponse.json(
      { error: '로그인이 필요합니다.', code: 'NO_USER_ID' },
      { status: 401 }
    );
  }

  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('latitude, longitude')
    .eq('user_id', userId)
    .single();

  if (!userData?.latitude || !userData?.longitude) {
    return NextResponse.json(
      { error: '유저 위치 정보가 없습니다.', code: 'NO_USER_LOCATION' },
      { status: 400 }
    );
  }

  if (userError) {
    return NextResponse.json(
      { error: '유저 정보 조회 실패', code: 'USER_FETCH_FAIL' },
      { status: 500 }
    );
  }

  const lat = userData.latitude;
  const lng = userData.longitude;

  const { data: auctionData, error } = await supabase.from('auction').select(`
  auction_id,
  product_id,
  auction_status,
  min_price,
  auction_end_at,
  product:product_id (
    title,
    category,
    latitude,
    longitude,
    exhibit_user_id,
    product_image (
      image_url,
      order_index
    ),
    address
  ),
  bid_history!auction_id (
    bid_price
  ),
  created_at
`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const filtered = (auctionData as unknown as AuctionList[])
    .filter((item) => {
      const { product, auction_status, auction_end_at } = item;
      const distance = getDistanceKm(lat, lng, product.latitude, product.longitude);
      const within5km = distance <= 5;
      const matchSearch = search || searcher(product.title, search);
      const matchCate = cate === 'all' || product.category === cate;

      const now = new Date();
      const isEnded = auction_status === '경매 종료';
      const isDeadlineToday = new Date(auction_end_at).toDateString() === now.toDateString();
      const isWaiting = auction_status === '경매 대기';

      const filterDeadline = !hasDeadlineToday || (hasDeadlineToday && isDeadlineToday);
      const filterExcludeEnded = !hasExcludeEnded || (hasExcludeEnded && !isEnded);

      return (
        !isWaiting && within5km && matchSearch && matchCate && filterDeadline && filterExcludeEnded
      );
    })
    .map((item) => {
      const bidPrices = item.bid_history?.map((b) => b.bid_price) ?? [];
      const highestBid = bidPrices.length > 0 ? Math.max(...bidPrices) : null;
      return {
        id: item.auction_id,
        thumbnail:
          item.product.product_image?.find((img) => img.order_index === 0)?.image_url ??
          '/default.png',
        title: item.product.title,
        address: item.product.address,
        bidCount: item.bid_history?.length ?? 0,
        bidPrice: highestBid ?? item.min_price,
        auctionEndAt: item.auction_end_at,
        auctionStatus: item.auction_status,
        createdAt: item.created_at,
      };
    });

  const limit = Number(searchParams.get('limit')) || 10;
  const offset = Number(searchParams.get('offset')) || 0;

  const sorted = filtered.sort((a, b) => {
    if (sort === 'popular') {
      return b.bidCount - a.bidCount;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const sliced = sorted.slice(offset * limit, (offset + 1) * limit);

  return NextResponse.json({
    data: sliced,
    nextOffset: sliced.length < limit ? null : offset + 1,
  });
}
