'use client';

import ProductImageSlider from './ProductImageSlider';
import { AlarmClock, PencilLine } from 'lucide-react';
import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import { formatTimestamptz } from '@/shared/lib/formatTimestamp';
import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import BottomBar from './BottomBar';
import { useEffect, useState, use } from 'react';
import { Auction } from '@/app/api/product/route';
import Loading from '@/shared/ui/Loading/Loading';

const ProductDetailPage = ({ params }: { params: Promise<{ shortId: string }> }) => {
  const resolvedParams = use(params);
  const [data, setData] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/auction/${resolvedParams.shortId}`);

        if (!response.ok) {
          throw new Error('경매 정보를 가져올 수 없습니다.');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.shortId]);

  if (loading) return <Loading />;
  if (error) return <p>오류: {error}</p>;
  if (!data) return <p>경매 정보를 찾을 수 없습니다.</p>;

  const auction = data;
  const mapped = {
    auctionId: auction.auction_id,
    productTitle: auction.product?.title,
    productDescription: auction.product?.description,
    images: auction.product?.product_image ?? [],
    minPrice: auction.min_price,
    auctionEndAt: auction.auction_end_at,
    exhibitUser: auction.product?.exhibit_user,
    currentHighestBid: auction.current_highest_bid || auction.min_price,
    bidHistory: auction.bid_history,
  };

  return (
    <div className="flex flex-col gap-[25px] pb-[112px]">
      {/* 이미지 슬라이더 */}
      <ProductImageSlider images={mapped.images} />

      {/* 경매 상품 내용 */}
      <div className="p-box flex flex-col gap-[25px]">
        <div className="typo-subtitle-bold">{mapped.productTitle}</div>

        <div>
          <div className="typo-caption-regular text-neutral-600">최고 입찰가</div>
          <div className="typo-subtitle-bold">
            {formatNumberWithComma(mapped.currentHighestBid)}원
          </div>
        </div>

        <div className="bg-neutral-050 flex w-full items-center justify-between px-[12px] py-[9px]">
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-[3px]">
              <PencilLine size={12} className="text-neutral-600" />
              <div className="text-[10px] text-neutral-600">입찰 시작가</div>
            </div>
            <div className="typo-caption-medium">{formatNumberWithComma(mapped.minPrice)}원</div>
          </div>
          <div className="h-[12px] w-[1px] bg-neutral-300"></div>
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-[3px]">
              <AlarmClock size={12} className="text-neutral-600" />
              <div className="text-[10px] text-neutral-600">입찰 마감 일자</div>
            </div>
            <div className="typo-caption-medium">{formatTimestamptz(mapped.auctionEndAt)}</div>
          </div>
        </div>

        <div className="typo-body-regular">{mapped.productDescription}</div>
      </div>
      <div className="h-[8px] w-full bg-neutral-100"></div>
      <div className="p-box">
        {/* 입찰 히스토리 (선택사항) */}
        {/* {mapped.bidHistory.length > 0 && (
          <div>
            <div className="typo-subtitle-bold mb-[10px]">입찰 현황</div>
            <div className="text-neutral-600 typo-caption-regular">
              총 {mapped.bidHistory.length}건의 입찰
            </div>
          </div>
        )}
        
        <div className="h-[8px] w-full bg-neutral-100"></div> */}

        {/* 판매자 정보 */}
        <div className="flex items-center gap-[19px]">
          <Avatar src={mapped.exhibitUser?.profile_img || undefined} className="size-[36px]" />
          <div className="flex flex-col gap-[5px]">
            <div className="typo-body-medium">{mapped.exhibitUser?.nickname}</div>
            <div className="typo-caption-regular">{mapped.exhibitUser?.address}</div>
          </div>
        </div>
      </div>

      <BottomBar
        shortId={resolvedParams.shortId}
        auctionEndAt={mapped.auctionEndAt}
        title={mapped.productTitle}
        lastPrice={String(mapped.currentHighestBid)}
      />
    </div>
  );
};

export default ProductDetailPage;
