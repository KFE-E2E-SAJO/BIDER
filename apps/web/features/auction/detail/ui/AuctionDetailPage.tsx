import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { AlarmClock, Info, PencilLine } from 'lucide-react';
import React, { useState } from 'react';
import { formatTimestamptz } from '@/shared/lib/formatTimestamp';
import BiddingStatusBoard from './BiddingStatusBoard';
import { getCategoryLabel } from '@/features/category/lib/utils';
import { CategoryValue } from '@/features/category/types';
import GoogleMapView from '@/features/location/ui/GoogleMapView';
import { Button } from '@repo/ui/components/Button/Button';
import { AuctionDetailContentProps } from '@/features/auction/detail/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/Tooltip/Tooltip';
import { isMoreThanOneHour } from '@/features/auction/secret/lib/utils';
import { toast } from '@repo/ui/components/Toast/Sonner';
import checkSecretViewHistory from '@/features/auction/secret/actions/checkSecretViewHistory';
import { BidHistoryWithUserNickname } from '@/entities/bidHistory/model/types';
import getBidHistory from '@/features/auction/secret/actions/getBidHistory';
const AuctionDetail = ({ data }: AuctionDetailContentProps) => {
  const [currentHighestBid, setCurrentHighestBid] = useState(data.currentHighestBid);
  const [showHighestBid, setShowHighestBid] = useState(false);
  const [bidHistory, setBidHistory] = useState<BidHistoryWithUserNickname[] | null>(null);

  const checkHighestBid = async () => {
    // 마감 한 시간 이하면 확인불가 모달
    if (!isMoreThanOneHour(data.auctionEndAt)) {
      toast({ content: '⏰ 최고 입찰가는 마감 1시간 전까지만 확인할 수 있어요.' });
      return;
    }
    //아직 아무도 입찰을 안했을 경우
    if (data.bidCnt <= 0) {
      toast({ content: '첫 번째 입찰자가 되어보세요!' });
      return;
    }
    // 사용자가 포인트 결제했는지 여부
    // 이미 했고 10분 안지났으면
    // 최고입찰가 보여주기 (BiddingStatusBoard 띄우기)
    const { hasPaid, isValid } = await checkSecretViewHistory(data.auctionId);

    if (hasPaid && isValid) {
      const history = await getBidHistory(data.auctionId);
      setBidHistory(history);
      setShowHighestBid(true);
      return;
    }
    // 이미 했고 10분 지났거나 아예 한적 없다면
    // 유저 포인트 조회
    let userPoint = 400;
    // 유저 포인트가 500미만이면 포인트 부족 모달
    if (userPoint < 500) {
      //500포인트 이상 있어야 최고 입찰가를 확인할 수 있어요.
      toast({ content: '500포인트 이상 있어야 최고 입찰가를 확인할 수 있어요.' });
      return;
    }
    // 포인트 500이상이면 포인트 차감 API 호출
    userPoint = userPoint - 500;
    if (true) {
      //포인트 차감 api성공
      //secret_bid_view_history에 데이터 추가해주고
      const history = await getBidHistory(data.auctionId);
      setBidHistory(history);
      setShowHighestBid(true);
    }
  };
  return (
    <>
      {/* 경매 상품 내용 */}
      <div className="p-box flex flex-col gap-[25px]">
        <div className="flex flex-col gap-[14px]">
          <div className="typo-subtitle-bold">{data.productTitle}</div>
          <u className="typo-caption-regular w-fit text-neutral-700">
            {getCategoryLabel(data.productCategory as CategoryValue)}
          </u>
        </div>

        <div>
          <div className="typo-caption-regular text-neutral-600">최고 입찰가</div>

          <div className="typo-subtitle-bold">
            {data.isSecret ? (
              <span className="text-event">******* </span>
            ) : (
              formatNumberWithComma(currentHighestBid as number)
            )}
            원
          </div>
        </div>

        <div className="bg-neutral-050 flex w-full items-center justify-between px-[12px] py-[9px]">
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-[3px]">
              <PencilLine size={12} className="text-neutral-600" />
              <div className="text-[10px] text-neutral-600">입찰 시작가</div>
            </div>
            <div className="typo-caption-medium">{formatNumberWithComma(data.minPrice)}원</div>
          </div>
          <div className="h-[12px] w-[1px] bg-neutral-300"></div>
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-[3px]">
              <AlarmClock size={12} className="text-neutral-600" />
              <div className="text-[10px] text-neutral-600">입찰 마감 일자</div>
            </div>
            <div className="typo-caption-medium">{formatTimestamptz(data.auctionEndAt)}</div>
          </div>
        </div>

        <div className="typo-body-regular whitespace-pre-line">{data.productDescription}</div>

        {/* 거래 희망 장소 */}
        {data.dealAddress && data.dealLocation && (
          <div className="flex flex-col gap-[14px]">
            <div className="flex items-end gap-[11px]">
              <div className="typo-subtitle-small-medium">거래 희망 장소</div>
              <div className="typo-body-regular text-neutral-700">{data.dealAddress}</div>
            </div>
            <div className="overflow-hidden rounded-[10px]">
              <GoogleMapView
                mapId="productDetail"
                height="h-[126px]"
                location={data.dealLocation}
                showMyLocation={true}
              />
            </div>
          </div>
        )}
      </div>

      <div className="h-[8px] w-full bg-neutral-100"></div>

      {/* 입찰 히스토리 */}
      {data.isSecret ? (
        <div className="p-box">
          <div className="mb-[14px]">
            <div className="typo-subtitle-small-medium mb-[14px]">입찰 현황판</div>
            <p className="typo-body-regular">
              <span className="typo-body-medium text-event">{data.bidCnt}명</span>이 이 상품에 입찰
              중이에요!
            </p>
          </div>
          {showHighestBid ? (
            bidHistory && (
              <BiddingStatusBoard
                data={bidHistory}
                auctionId={data.auctionId}
                onNewHighestBid={(newPrice) => setCurrentHighestBid(newPrice)}
              />
            )
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-event-light typo-body-medium text-event"
                    onClick={checkHighestBid}
                  >
                    최고 입찰가 확인하기
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end" className="mt-1">
                  500포인트로 최고 입찰가를 확인할 수 있어요
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ) : (
        <div className="p-box">
          <div className="items-baseline-last mb-[14px] flex justify-between">
            <div className="typo-subtitle-small-medium">입찰 현황판</div>
            <div className="typo-caption-regular flex items-center gap-1 text-neutral-600">
              <Info size={13} strokeWidth={2} stroke="var(--color-neutral-400)" /> 상위 5등까지만
              조회 가능합니다.
            </div>
          </div>
          <BiddingStatusBoard
            data={data.bidHistory}
            auctionId={data.auctionId}
            onNewHighestBid={(newPrice) => setCurrentHighestBid(newPrice)}
          />
        </div>
      )}
      <div className="h-[8px] w-full bg-neutral-100"></div>

      {/* 판매자 정보 */}
      <div className="p-box mb-[25px] flex items-center gap-[19px]">
        <Avatar src={data.exhibitUser?.profile_img || undefined} className="size-[40px]" />
        <div className="flex flex-col gap-[5px]">
          <div className="typo-body-medium">{data.exhibitUser?.nickname}</div>
          <div className="typo-caption-regular">{data.exhibitUser?.address}</div>
        </div>
      </div>
    </>
  );
};

export default AuctionDetail;
