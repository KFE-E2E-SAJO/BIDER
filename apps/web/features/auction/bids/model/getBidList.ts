import { ProductList } from '@/features/product/types';
import { BidDataWithStats, BidListParams } from '@/features/auction/bids/types';
import { AUCTION_STATUS } from '@/shared/consts/auctionStatus';

const getBidList = async (params: BidListParams): Promise<ProductList[]> => {
  const { filter, userId } = params;

  const res = await fetch(`/api/auction/bids?userId=${userId}`);
  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.error || 'Failed to fetch product list');
  }

  const typedData: BidDataWithStats[] = result.data;

  const shouldInclude = (item: BidDataWithStats) => {
    const { auction, is_awarded } = item;
    const { product, auction_status } = auction;

    if (product.latitude == null || product.longitude == null) return false;

    switch (filter) {
      case 'progress':
        return auction_status === AUCTION_STATUS.IN_PROGRESS;
      case 'win':
        return auction_status === AUCTION_STATUS.ENDED && is_awarded === true;
      case 'fail':
        return auction_status === AUCTION_STATUS.ENDED && is_awarded === false;
      default:
        return true;
    }
  };

  const filtered = typedData.filter(shouldInclude);

  return filtered.map((item) => ({
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
