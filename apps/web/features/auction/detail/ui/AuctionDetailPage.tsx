import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { AlarmClock, PencilLine } from 'lucide-react';
import React from 'react';
import { AuctionDetailContentProps } from '../types';
import { formatTimestamptz } from '@/shared/lib/formatTimestamp';

const AuctionDetail = ({ data }: AuctionDetailContentProps) => {
  return (
    <>
      {/* 경매 상품 내용 */}
      <div className="p-box flex flex-col gap-[25px]">
        <div className="typo-subtitle-bold">{data.productTitle}</div>

        <div>
          <div className="typo-caption-regular text-neutral-600">최고 입찰가</div>
          <div className="typo-subtitle-bold">
            {formatNumberWithComma(data.currentHighestBid)}원
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
      </div>
      <div className="h-[8px] w-full bg-neutral-100"></div>
      <div className="p-box">
        {/* 입찰 히스토리 (선택사항) */}
        {/* {data.bidHistory.length > 0 && (
          <div>
            <div className="typo-subtitle-bold mb-[10px]">입찰 현황</div>
            <div className="text-neutral-600 typo-caption-regular">
              총 {data.bidHistory.length}건의 입찰
            </div>
          </div>
        )}
        
        <div className="h-[8px] w-full bg-neutral-100"></div> */}

        {/* 판매자 정보 */}
        <div className="flex items-center gap-[19px]">
          <Avatar src={data.exhibitUser?.profile_img || undefined} className="size-[36px]" />
          <div className="flex flex-col gap-[5px]">
            <div className="typo-body-medium">{data.exhibitUser?.nickname}</div>
            <div className="typo-caption-regular">{data.exhibitUser?.address}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionDetail;
