'use client';

import React, { use } from 'react';
import { useAuctionDetail } from '../model/useAuctionDetail';
import Loading from '@/shared/ui/Loading/Loading';
import { AuctionDetailContent } from '../types';
import ProductImageSlider from './ProductImageSlider';
import AuctionDetail from './AuctionDetail';
import BottomBar from './BottomBar';
import { useAuthStore } from '@/shared/model/authStore';

const AuctionDetailPageContent = ({ params }: { params: Promise<{ shortId: string }> }) => {
  const resolvedParams = use(params);
  const { data, isLoading, error } = useAuctionDetail(resolvedParams.shortId);
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
          shortId={resolvedParams.shortId}
          auctionEndAt={mapped.auctionEndAt}
          title={mapped.productTitle}
          lastPrice={String(mapped.currentHighestBid)}
        />
      )}
    </div>
  );
};

export default AuctionDetailPageContent;
