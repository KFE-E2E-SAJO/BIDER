'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogHeader, DialogTitle } from '@repo/ui/components/Dialog/Dialog';
import { Input } from '@repo/ui/components/Input/Input';
import { Button } from '@repo/ui/components/Button/Button';
import { getCountdown } from '@/shared/lib/getCountdown';
import { BidDialogProps } from '../types';
import { useBidSubmit } from '../model/useBidSubmit';
import { formatBidPrice, getInitialBidPrice } from '../lib/utils';
import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';

export const BidDialog = ({
  shortId,
  auctionEndAt,
  title,
  lastPrice,
  open,
  onOpenChange,
}: BidDialogProps) => {
  const [biddingPrice, setBiddingPrice] = useState(getInitialBidPrice(lastPrice));
  const [countdown, setCountdown] = useState('');

  const { onSubmitBid, isSubmitting } = useBidSubmit(shortId);

  useEffect(() => {
    const update = () => setCountdown(getCountdown(auctionEndAt));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [auctionEndAt]);

  const handleBiddingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatBidPrice(raw);
    setBiddingPrice(formatted);
  };

  const handleBidSubmit = async () => {
    await onSubmitBid(biddingPrice);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="w-full">
      {/* 타이틀 (공통컴포넌트 설정과 달라서 화면에서 안 보이게 처리) */}
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="typo-subtitle-bold mb-[22px] text-left">{title}</div>
      <div className="bg-neutral-050 flex w-full items-center justify-around px-[21px] py-[11px]">
        <div className="flex flex-col">
          <div className="typo-caption-medium text-neutral-600">최고 입찰가</div>
          <div className="typo-body-bold">{formatNumberWithComma(lastPrice)}원</div>
        </div>
        <div className="h-[38px] w-[1px] bg-neutral-300"></div>
        <div className="flex flex-col">
          <div className="typo-caption-medium text-neutral-600">입찰 마감</div>
          <div className="typo-body-bold">{countdown}</div>
        </div>
      </div>
      <div className="mt-[34px] flex items-center justify-between">
        <div className="typo-body-regular">희망 입찰가</div>
        <div className="flex items-end gap-[8px]">
          <Input
            inputStyle="text-right typo-body-bold"
            className="w-[168px]"
            value={biddingPrice}
            onChange={handleBiddingPriceChange}
            placeholder="입찰가를 적어주세요."
            required
          />
          <div className="typo-body-medium">원</div>
        </div>
      </div>
      <Button className="mt-[33px]" onClick={handleBidSubmit} disabled={isSubmitting}>
        {isSubmitting ? '입찰 중...' : '입찰하기'}
      </Button>
    </Dialog>
  );
};
