import { Button } from '@repo/ui/components/Button/Button';
import { Check } from 'lucide-react';
import React from 'react';

const BidCompleteView = () => {
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
          <p className="typo-body-regular w-[252px] whitespace-pre-line">
            {'무빙큐빅스TV 삼탠바이미 50인치 화이트 상태 좋음'}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="typo-caption-regular text-neutral-600">입찰 마감 일자</p>
          <p className="typo-body-regular w-[252px] whitespace-pre-line">{'25/06/28 18:00'}</p>
        </div>
        <div className="flex justify-between">
          <p className="typo-caption-regular text-neutral-600">내 입찰가</p>
          <p className="typo-body-regular w-[252px] whitespace-pre-line">{'220,000원'}</p>
        </div>
      </div>
      <Button>내 입찰 내역 보기</Button>
    </div>
  );
};

export default BidCompleteView;
