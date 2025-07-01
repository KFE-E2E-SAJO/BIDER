import { supabase } from '@/shared/lib/supabaseClient';
import fetchBidList from '../lib/util';

interface BidListProps {
  filter: 'all' | 'progress' | 'win' | 'fail';
}

export interface BidHistoryFromDB {
  is_awarded: boolean;
  bid_user_id: string;
  bid_id: string;
  bid_at: string;
  bid_price: number;
  auction: {
    auction_id: string;
    auction_status: string;
    auction_end_at: string;
    min_price: number;
    is_pending: boolean;
    winning_bid_user_id: string | null;
    winner?: {
      user_id: string;
    } | null;
    product: {
      product_id: string;
      title: string;
      category: string | null;
      exhibit_user_id: string;
      seller: {
        user_id: string;
      };
      product_image: {
        image_url: string;
        order_index: number;
      }[];
      profiles?: {
        address: string;
        latitude: number;
        longitude: number;
      } | null;
    };
  };
}

const getBidList = async (filter: BidListProps['filter']) => {
  const user = { id: '0f521e94-ed27-479f-ab3f-e0c9255886c5' };
  if (!user) return null;

  const bidData = await fetchBidList(user.id);
  if (!bidData) return null;

  const typedData = bidData as unknown as BidHistoryFromDB[];

  const filtered = typedData.filter((item) => {
    const { auction } = item;
    const { product } = auction;

    if (!product?.profiles?.latitude || !product.profiles.longitude) return false;

    const isProgress = filter === 'progress' && auction.auction_status === '경매 중';
    const isWin = filter === 'win' && item.is_awarded === true;
    const isFail =
      filter === 'fail' && item.is_awarded === false && auction.auction_status === '종료';

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
    location: item.auction.product.profiles?.address ?? '위치 정보 없음',
    bidCount: bidCountMap[item.auction.auction_id] ?? 0,
    price: item.bid_price,
    minPrice: item.auction.min_price ?? 0,
    auctionEndAt: item.auction.auction_end_at,
    auctionStatus: item.auction.auction_status,
    winnerId: item.auction.winner?.user_id,
    sellerId: item.auction.product.seller?.user_id,
    isAwarded: item.is_awarded,
    isPending: item.auction.is_pending,
    productId: item.auction.product.product_id,
  }));
};

export default getBidList;
