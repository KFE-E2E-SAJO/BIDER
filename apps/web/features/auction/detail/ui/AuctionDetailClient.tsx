'use client';

import Loading from '@/shared/ui/Loading/Loading';
import { useAuctionDetail } from '../model/useAuctionDetail';
import ProductImageSlider from './ProductImageSlider';
import AuctionDetail from './AuctionDetail';
import { AuctionDetailContent } from '../types';
import { useAuthStore } from '@/shared/model/authStore';
import dynamic from 'next/dynamic';

const BottomBar = dynamic(() => import('./BottomBar'), {
  ssr: false,
  loading: () => (
    <div className="bg-neutral-0 fixed bottom-0 left-[50%] z-50 h-[102px] w-full max-w-[600px] translate-x-[-50%] border-t border-neutral-100 px-[16px] pt-[15px]">
      <div className="flex items-center justify-between">
        <div>
          <div className="typo-subtitle-small-medium">입찰 마감 시간</div>
          <span className="text-sm text-neutral-700">-</span>
        </div>
        <div className="flex shrink-0 items-center gap-[12px]">
          <div className="h-[40px] w-[142px] animate-pulse rounded bg-neutral-200"></div>
          <div className="h-[40px] w-[53px] animate-pulse rounded bg-neutral-200"></div>
        </div>
      </div>
    </div>
  ),
});

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
    exhibitUser: data.product?.exhibit_user,
    currentHighestBid: data.current_highest_bid || data.min_price,
    bidHistory: data.bid_history,
    dealLocation:
      data.deal_latitude != null && data.deal_longitude != null
        ? { lat: data.deal_latitude, lng: data.deal_longitude }
        : undefined,
    dealAddress: data.deal_address ?? undefined,
  };

  const isProductMine = user.user?.id === mapped.exhibitUser.user_id;

  return (
    <div className={`flex flex-col gap-[25px] ${isProductMine ? '' : 'pb-[66px]'}`}>
      <ProductImageSlider images={mapped.images} />
      <AuctionDetail data={mapped} />
      {!isProductMine && (
        <BottomBar
          shortId={shortId}
          auctionEndAt={mapped.auctionEndAt}
          title={mapped.productTitle}
          lastPrice={String(mapped.currentHighestBid)}
        />
      )}
    </div>
  );
};

export default AuctionDetailClient;
