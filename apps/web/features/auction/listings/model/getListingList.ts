import { supabase } from '@/shared/lib/supabaseClient';
import fetchListingList from '../lib/util';

interface ListingListProps {
  filter: 'all' | 'pending' | 'progress' | 'win' | 'fail';
}

export interface ListingFromDB {
  auction_id: string;
  auction_status: string;
  auction_end_at: string;
  min_price: number;
  winning_bid_id: string | null;
  winning_bid_user_id: string | null;
  created_at: string;
  updated_at: string | null;

  winner?: {
    user_id: string;
    nickname: string;
    profile_img: string | null;
  } | null;

  product: {
    product_id: string;
    title: string;
    category: string | null;
    exhibit_user_id: string;

    seller: {
      user_id: string;
      nickname: string;
      profile_img: string | null;
    };

    location: {
      address: string;
      latitude: number;
      longitude: number;
    } | null;

    product_image: {
      image_url: string;
      order_index: number;
    }[];

    profiles?: {
      address: string;
      latitude: number;
      longitude: number;
    } | null;

    pending_auction: {
      pending_auction_id: string;
      auction_status: string;
      auction_end_at: string;
      scheduled_create_at: string;
      completed_at: string | null;
    }[];
  };

  bid_history: {
    bid_id: string;
    bid_user_id: string;
    bid_price: number;
    bid_at: string;
    is_awarded: boolean;

    bidder: {
      user_id: string;
      nickname: string;
      profile_img: string | null;
    } | null;
  }[];
}

const getListingList = async (filter: ListingListProps['filter']) => {
  const user = { id: '0f521e94-ed27-479f-ab3f-e0c9255886c5' };
  if (!user) return null;

  const listingData = await fetchListingList(user.id);
  if (!listingData) return null;

  const typedData = listingData as unknown as ListingFromDB[];

  // 2. 내가 입찰한 경매만 필터링
  const filtered = typedData
    .map((auction) => {
      const myBid = auction.bid_history.find((b) => b.bid_user_id === user.id);
      if (!myBid) return null;

      const { product } = auction;
      if (!product?.profiles?.latitude || !product.profiles.longitude) return null;

      const isProgress = filter === 'progress' && auction.auction_status === '경매 중';
      const isWin = filter === 'win' && myBid.is_awarded === true;
      const isFail =
        filter === 'fail' && myBid.is_awarded === false && auction.auction_status === '종료';
      const isPending = filter === 'pending' && auction.product.pending_auction !== null;

      const pass = filter === 'all' || isProgress || isWin || isFail || isPending;

      return pass ? { auction, myBid } : null;
    })
    .filter(Boolean) as { auction: ListingFromDB; myBid: ListingFromDB['bid_history'][number] }[];

  // 3. 입찰 수 계산
  const auctionIds = filtered.map(({ auction }) => auction.auction_id);

  const { data: bidCountRaw } = await supabase
    .from('bid_history')
    .select('auction_id, bid_id')
    .in('auction_id', auctionIds);

  const bidCountMap: Record<string, number> = {};
  for (const item of bidCountRaw ?? []) {
    const auctionId = item.auction_id;
    bidCountMap[auctionId] = (bidCountMap[auctionId] ?? 0) + 1;
  }

  //4. 최종 가공 데이터 반환
  return filtered.map(({ auction, myBid }) => ({
    id: myBid.bid_id,
    thumbnail:
      auction.product.product_image.find((img) => img.order_index === 0)?.image_url ??
      '/default.png',
    title: auction.product.title,
    location: auction.product.profiles?.address ?? '위치 정보 없음',
    bidCount: bidCountMap[auction.auction_id] ?? 0,
    price: myBid.bid_price,
    minPrice: auction.min_price,
    auctionEndAt: auction.auction_end_at,
    auctionStatus: auction.auction_status,
    winnerId: auction.winner?.user_id ?? null,
    sellerId: auction.product.seller.user_id,
    isAwarded: myBid.is_awarded,
    isPending: !!auction.product.pending_auction,
  }));
};

export default getListingList;
