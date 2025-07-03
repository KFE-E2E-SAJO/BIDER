import { supabase } from '@/shared/lib/supabaseClient';
import fetchBidList from '../lib/util';

interface BidListProps {
  filter: 'all' | 'progress' | 'win' | 'fail';
}

export interface BidHistoryFromDB {
  bid_id: string;
  bid_price: number;
  is_awarded: boolean;
  bid_user_id: string;
  bid_at: string;

  auction: {
    auction_id: string;
    auction_status: string;
    auction_end_at: string;
    min_price: number;
    winning_bid_user_id: string | null;

    product: {
      product_id: string;
      title: string;
      category: string | null;
      exhibit_user_id: string;
      description: string;
      latitude: number;
      longitude: number;
      address: string | null;

      product_image: {
        image_url: string;
        order_index: number;
      }[];
    };
  };
}

const getBidList = async (filter: BidListProps['filter']) => {
  const user = { id: 'c6d80a1e-b154-4cd0-b17d-c7308c46ebaa' };
  if (!user) return null;

  const bidData = await fetchBidList(user.id);
  if (!bidData) return null;

  const typedData = bidData as BidHistoryFromDB[];

  const filtered = typedData.filter((item) => {
    const { auction } = item;
    const { product } = auction;

    if (product.latitude == null || product.longitude == null) return false;

    const isProgress = filter === 'progress' && auction.auction_status === '경매 중';
    const isWin =
      filter === 'win' && auction.auction_status === '경매 종료' && item.is_awarded === true;
    const isFail =
      filter === 'fail' && auction.auction_status === '경매 종료' && item.is_awarded === false;

    return filter === 'all' || isProgress || isWin || isFail;
  });

  const auctionIds = filtered.map((item) => item.auction.auction_id);

  const { data: bidCountRaw } = await supabase
    .from('bid_history')
    .select('auction_id, bid_id')
    .in('auction_id', auctionIds);

  const bidCountMap: Record<string, number> = {};
  for (const item of bidCountRaw ?? []) {
    const auctionId = item.auction_id;
    bidCountMap[auctionId] = (bidCountMap[auctionId] ?? 0) + 1;
  }

  return filtered.map((item) => ({
    id: item.bid_id,
    thumbnail:
      item.auction.product.product_image.find((img) => img.order_index === 0)?.image_url ??
      '/default.png',
    title: item.auction.product.title,
    location: item.auction.product.address ?? '위치 정보 없음',
    bidCount: bidCountMap[item.auction.auction_id] ?? 0,
    price: item.bid_price,
    minPrice: item.auction.min_price ?? 0,
    auctionEndAt: item.auction.auction_end_at,
    auctionStatus: item.auction.auction_status,
    winnerId: item.auction.winning_bid_user_id ?? null,
    sellerId: item.auction.product.exhibit_user_id ?? '',
    isAwarded: item.is_awarded,
    productId: item.auction.product.product_id,
  }));
};

export default getBidList;
