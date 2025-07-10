'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogHeader, DialogTitle } from '@repo/ui/components/Dialog/Dialog';
import { Input } from '@repo/ui/components/Input/Input';
import { Button } from '@repo/ui/components/Button/Button';
import { getCountdown } from '@/shared/lib/getCountdown';
import { BidDialogProps } from '../types';
import { useBidSubmit } from '../model/useBidSubmit';
import { formatBidPrice, formatBidPriceWithCurrency, getInitialBidPrice } from '../lib/utils';

export const BidDialog = ({
  shortId,
  auctionEndAt,
  title,
  lastPrice,
  open,
  onOpenChange,
}: BidDialogProps) => {
  const [biddingPrice, setBiddingPrice] = useState(getInitialBidPrice(lastPrice));
  const [biddingPriceWon, setBiddingPriceWon] = useState(
    formatBidPriceWithCurrency(getInitialBidPrice(lastPrice))
  );
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
    setBiddingPriceWon(formatBidPriceWithCurrency(formatted));
  };

  const handleBidSubmit = async () => {
    await onSubmitBid(biddingPrice, () => {
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 타이틀 (공통컴포넌트 설정과 달라서 화면에서 안 보이게 처리) */}
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="typo-subtitle-bold mb-[22px] text-left">{title}</div>
      <div className="bg-neutral-050 flex w-full justify-between px-[21px] py-[11px]">
        <div className="typo-body-regular">입찰 마감</div>
        <div className="typo-body-bold">{countdown}</div>
      </div>
      <div className="mt-[34px] flex items-center justify-between">
        <div className="typo-body-regular">희망 입찰가</div>
        <Input
          className="typo-body-bold w-[168px]"
          value={biddingPriceWon}
          onChange={handleBiddingPriceChange}
          placeholder="입찰가를 적어주세요."
          required
        />
      </div>
      <Button className="mt-[33px]" onClick={handleBidSubmit} disabled={isSubmitting}>
        {isSubmitting ? '입찰 중...' : '입찰하기'}
      </Button>
    </Dialog>
  );
};
