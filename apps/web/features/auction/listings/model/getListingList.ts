import { ProductList } from '@/features/product/types';
import { ListingData, ListingListParams } from '@/features/auction/listings/types';
import { AUCTION_STATUS } from '@/shared/consts/auctionStatus';

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
      const myBid = auction?.bid_history?.find((b: any) => b.bid_user_id === userId);

      const hasLocation = product.latitude != null && product.longitude != null;
      if (!hasLocation || !auction) return null;

      let pass = false;

      switch (filter) {
        case 'pending':
          pass = auction.auction_status === AUCTION_STATUS.PENDING;
          break;
        case 'progress':
          pass = auction.auction_status === AUCTION_STATUS.IN_PROGRESS;
          break;
        case 'win':
          pass = auction.auction_status === AUCTION_STATUS.ENDED && !!auction.winning_bid_user_id;
          break;
        case 'fail':
          pass = auction.auction_status === AUCTION_STATUS.ENDED && !auction.winning_bid_user_id;
          break;
        case 'all':
        default:
          pass = true;
      }

      return pass ? { product, auction, myBid } : null;
    })
    .filter(Boolean) as {
    product: any;
    auction?: any;
    myBid?: any;
  }[];

  return filtered.map(({ product, auction, myBid }) => ({
    id:
      auction.auction_status === AUCTION_STATUS.PENDING ? product.product_id : auction?.auction_id,
    thumbnail:
      product.product_image?.find((img: any) => img.order_index === 0)?.image_url ?? '/default.png',
    title: product.title,
    address: product.address ?? '위치 정보 없음',
    bidCount: auction.bid_history.length,
    price: myBid?.bid_price ?? 0,
    minPrice: auction?.min_price ?? 0,
    auctionEndAt: auction?.auction_end_at ?? '',
    auctionStatus: auction?.auction_status,
    winnerId: auction?.winning_bid_user_id ?? null,
    sellerId: product.exhibit_user_id,
    isAwarded: myBid?.is_awarded ?? false,
    isPending: auction.auction_status === AUCTION_STATUS.PENDING,
  }));
};

export default getListingList;
