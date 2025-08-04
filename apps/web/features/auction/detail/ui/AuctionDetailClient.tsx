'use client';

import Loading from '@/shared/ui/Loading/Loading';

import { useAuthStore } from '@/shared/model/authStore';
import { AuctionDetailContent } from '@/features/auction/detail/types';
import { useAuctionDetail } from '@/features/auction/detail/model/useAuctionDetail';
import ProductImageSlider from '@/features/auction/detail/ui/ProductImageSlider';
import AuctionDetail from '@/features/auction/detail/ui/AuctionDetail';
import BottomBar from '@/features/auction/detail/ui/BottomBar';

const AuctionDetailClient = ({ shortId }: { shortId: string }) => {
  const { data, isLoading, error } = useAuctionDetail(shortId);
  const user = useAuthStore();

  if (isLoading) return <Loading />;
  if (error) return <p>오류: {(error as Error).message}</p>;
  if (!data) return <p>경매 정보를 찾을 수 없습니다.</p>;

  const mapped: AuctionDetailContent = {
    auctionId: data.auction_id,
    productTitle: data.product?.title,
    productCategory: data.product?.category,
    productDescription: data.product?.description,
    images: data.product?.product_image ?? [],
    minPrice: data.min_price,
    auctionEndAt: data.auction_end_at,
    bidHistory: data.bid_history,
    exhibitUser: data.product?.exhibit_user,
    currentHighestBid: data.is_secret ? null : data.current_highest_bid || data.min_price,
    dealLocation:
      data.deal_latitude != null && data.deal_longitude != null
        ? { lat: data.deal_latitude, lng: data.deal_longitude }
        : undefined,
    dealAddress: data.deal_address ?? undefined,
    auctionStatus: data.auction_status,
    isSecret: data.is_secret,
    bidCnt: data.bid_cnt,
  };

  const isProductMine = user.user?.id === mapped.exhibitUser.user_id;

  return (
    <div className={`flex flex-col gap-[25px] ${isProductMine ? '' : 'pb-[66px]'}`}>
      <ProductImageSlider images={mapped.images} />
      <AuctionDetail data={mapped} isProductMine={isProductMine} />
      {!isProductMine && (
        <BottomBar
          shortId={shortId}
          auctionEndAt={mapped.auctionEndAt}
          title={mapped.productTitle}
          lastPrice={mapped.currentHighestBid}
          isSecret={mapped.isSecret}
          minPrice={mapped.minPrice}
        />
      )}
    </div>
  );
};

export default AuctionDetailClient;
