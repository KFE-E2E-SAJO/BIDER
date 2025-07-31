import { ProductList } from '@/features/product/types';
import { BidDataWithStats, BidListParams } from '@/features/auction/bids/types';

const getBidList = async (params: BidListParams): Promise<ProductList[]> => {
  const { filter, userId } = params;

  const res = await fetch(`/api/auction/bids?userId=${userId}&filter=${filter}`);
  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.error || '데이터 로딩 실패');
  }

  console.log(filter);

  return result.data.map((item: BidDataWithStats) => ({
    id: item.auction.auction_id,
    thumbnail:
      item.auction.product.product_image.find((img) => img.order_index === 0)?.image_url ??
      '/default.png',
    title: item.auction.product.title,
    address: item.auction.product.address ?? '위치 정보 없음',
    bidCount: item.bidCount,
    minPrice: item.maxPrice,
    myBidPrice: item.bid_price,
    auctionEndAt: item.auction.auction_end_at,
    auctionStatus: item.auction.auction_status,
    winnerId: item.auction.winning_bid_user_id ?? null,
    sellerId: item.auction.product.exhibit_user_id ?? '',
    isAwarded: item.is_awarded,
    productId: item.auction.product.product_id,
  }));
};

export default getBidList;
