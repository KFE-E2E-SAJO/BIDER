'use server';

import { AuctionList } from '@/entities/auction/model/types';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { AuctionListParams, AuctionListResponse } from '@/features/auction/list/types';
import { getDistanceKm } from '@/features/product/lib/utils';
import { searcher } from '@/features/search/lib/utils';
import getUserId from '@/shared/lib/getUserId';
import { supabase } from '@/shared/lib/supabaseClient';

interface GetAuctionListActionProps {
  limit?: number;
  offset?: number;
  params: AuctionListParams;
}

export async function getAuctionListAction(
  props: GetAuctionListActionProps
): Promise<AuctionListResponse | null> {
  const { limit = 5, offset = 0, params = DEFAULT_AUCTION_LIST_PARAMS } = props;
  const { search, cate, sort, filter } = params;
  const userId = await getUserId();

  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('latitude, longitude')
    .eq('user_id', userId)
    .single();

  if (!userData?.latitude || !userData?.longitude || userError) {
    return null;
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
    return null;
  }

  const hasDeadlineToday = filter.includes('deadline-today');
  const hasExcludeEnded = filter.includes('exclude-ended');

  const filtered = (auctionData as unknown as AuctionList[])
    .filter((item) => {
      const { product, auction_status, auction_end_at } = item;
      const distance = getDistanceKm(lat, lng, product.latitude, product.longitude);
      const within5km = distance <= 5;
      const matchSearch = !search || searcher(product.title, search.toLowerCase());
      const matchCate = cate === 'all' || product.category === cate;

      const now = new Date();
      const isEnded = auction_status === '경매 종료';
      const isWaiting = auction_status === '경매 대기';
      const isDeadlineToday = new Date(auction_end_at).toDateString() === now.toDateString();

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

  const sorted = filtered.sort((a, b) => {
    if (sort === 'popular') {
      return b.bidCount - a.bidCount;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const sliced = sorted.slice(offset * limit, (offset + 1) * limit);

  return {
    data: sliced,
    nextOffset: sliced.length < limit ? null : offset + 1,
  };
}
