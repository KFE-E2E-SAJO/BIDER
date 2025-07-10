import { supabase } from '@/shared/lib/supabaseClient';
import { ProductList } from '@/features/product/types';

interface ListingListParams {
  filter: 'all' | 'pending' | 'progress' | 'win' | 'fail';
  userId: string;
}

interface ListingData {
  product_id: string;
  created_at: string;
  exhibit_user_id: string;
  title: string;
  description: string;
  updated_at: string | null;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
  product_image: {
    [key: string]: string;
  }[];
  pending_auction: {
    [key: string]: any;
  }[];
  auction: {
    [key: string]: any;
  }[];
}
const getListingList = async (params: ListingListParams): Promise<ProductList[]> => {
  const { filter, userId } = params;

  const res = await fetch(`/api/auction/listings?userId=${userId}`);
  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.error || 'Failed to fetch product list');
  }

  const listingData: ListingData[] = result.data;

  const filtered = listingData
    .map((product) => {
      const auction = Array.isArray(product.auction) ? product.auction[0] : product.auction;
      const pending = Array.isArray(product.pending_auction)
        ? product.pending_auction[0]
        : product.pending_auction;
      const myBid = auction?.bid_history?.find((b: any) => b.bid_user_id === userId);

      const hasLocation = product.latitude && product.longitude;

      const isPending = filter === 'pending' && pending?.pending_auction_id;
      const isProgress = filter === 'progress' && auction && auction.auction_status === '경매 중';
      const isWin =
        filter === 'win' &&
        auction &&
        auction.auction_status === '경매 종료' &&
        auction.winning_bid_user_id;
      const isFail =
        filter === 'fail' &&
        auction &&
        auction.auction_status === '경매 종료' &&
        !auction.winning_bid_user_id;
      const pass = filter === 'all' || isPending || isProgress || isWin || isFail;

      return pass && hasLocation ? { product, auction, pending, myBid } : null;
    })
    .filter(Boolean) as {
    product: any;
    auction?: any;
    pending?: any;
    myBid?: any;
  }[];

  const auctionIds = filtered.map(({ auction }) => auction?.auction_id).filter(Boolean);

  const { data: bidCountRaw } = await supabase
    .from('bid_history')
    .select('auction_id, bid_id')
    .in('auction_id', auctionIds);

  const bidCountMap: Record<string, number> = {};
  for (const item of bidCountRaw ?? []) {
    const auctionId = item.auction_id;
    bidCountMap[auctionId] = (bidCountMap[auctionId] ?? 0) + 1;
  }

  return filtered.map(({ product, auction, pending, myBid }) => ({
    id: pending ? product.product_id : auction?.auction_id,
    thumbnail:
      product.product_image?.find((img: any) => img.order_index === 0)?.image_url ?? '/default.png',
    title: product.title,
    address: product.address ?? '위치 정보 없음',
    bidCount: auction?.auction_id ? (bidCountMap[auction.auction_id] ?? 0) : 0,
    price: myBid?.bid_price ?? 0,
    minPrice: auction?.min_price ?? pending?.min_price ?? 0,
    auctionEndAt: auction?.auction_end_at ?? pending?.auction_end_at ?? '',
    auctionStatus: auction?.auction_status ?? pending?.auction_status ?? '경매 대기',
    winnerId: auction?.winning_bid_user_id ?? null,
    sellerId: product.exhibit_user_id,
    isAwarded: myBid?.is_awarded ?? false,
    isPending: !!pending?.pending_auction_id,
  }));
};

export default getListingList;
