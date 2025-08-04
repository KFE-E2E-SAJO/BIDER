import { ProductList } from '@/features/product/types';
import { ListingData, ListingListParams } from '@/features/auction/listings/types';
import { AUCTION_STATUS } from '@/shared/consts/auctionStatus';

const getListingList = async (params: ListingListParams): Promise<ProductList[]> => {
  const { filter, userId } = params;

  const res = await fetch(`/api/auction/listings?userId=${userId}&filter=${filter}`, {
    next: { revalidate: 60 },
  });
  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.error || '데이터 로딩 실패');
  }

  const listingData: ListingData[] = result.data;

  return listingData.map((product) => {
    const auction = Array.isArray(product.auction) ? product.auction[0] : product.auction;
    const myBid = auction?.bid_history?.find((b: any) => b.bid_user_id === product.exhibit_user_id); // seller 기준이라면 제외 가능

    return {
      id:
        auction?.auction_status === AUCTION_STATUS.PENDING
          ? product.product_id
          : auction?.auction_id,
      thumbnail:
        product.product_image?.find((img: any) => img.order_index === 0)?.image_url ??
        '/default.png',
      title: product.title,
      address: product.address ?? '위치 정보 없음',
      bidCount: auction?.bid_history.length ?? 0,
      price: myBid?.bid_price ?? 0,
      minPrice: auction?.bid_history?.length
        ? Math.max(...auction.bid_history.map((bid: any) => bid.bid_price))
        : (auction?.min_price ?? 0),
      auctionEndAt: auction?.auction_end_at ?? '',
      auctionStatus: auction?.auction_status,
      winnerId: auction?.winning_bid_user_id ?? null,
      sellerId: product.exhibit_user_id,
      isAwarded: myBid?.is_awarded ?? false,
      isPending: auction?.auction_status === AUCTION_STATUS.PENDING,
    };
  });
};

export default getListingList;
