'use client';

import { useBidStore } from '@/shared/model/bidStore';
import { Button } from '@repo/ui/components/Button/Button';
import { Check } from 'lucide-react';
import React from 'react';
import { formatBidDate } from '../lib/utils';
import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import { useRouter } from 'next/navigation';

const BidCompleteView = () => {
  const { bidInfo } = useBidStore();
  const router = useRouter();

  if (!bidInfo) {
    return <div>입찰 정보가 없습니다.</div>;
  }

  const { title, bid_price, bid_end_at } = bidInfo;

  return (
    <div className="p-box my-auto flex -translate-y-1/3 flex-col">
      <div className="flex w-full flex-col items-center gap-[11px]">
        <Button size="icon" className="bg-main h-[33px] w-[33px] rounded-full">
          <Check size={16} />
        </Button>
        <div className="typo-subtitle-small-medium">입찰이 완료되었습니다.</div>
      </div>
      <div className="my-[39px] flex w-full flex-col gap-[10px] border-b border-t border-neutral-100 py-[20px]">
        <div className="flex justify-between">
          <p className="typo-caption-regular text-neutral-600">제품명</p>
          <p className="typo-body-regular w-[252px] whitespace-pre-line">{title}</p>
        </div>
        <div className="flex justify-between">
          <p className="typo-caption-regular text-neutral-600">입찰 마감 일자</p>
          <p className="typo-body-regular w-[252px] whitespace-pre-line">
            {formatBidDate(bid_end_at)}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="typo-caption-regular text-neutral-600">내 입찰가</p>
          <p className="typo-body-regular w-[252px] whitespace-pre-line">
            {formatNumberWithComma(bid_price)}원
          </p>
        </div>
      </div>
      <Button onClick={() => router.push('/auction/bids')}>내 입찰 내역 보기</Button>
    </div>
  );
};

export default BidCompleteView;
