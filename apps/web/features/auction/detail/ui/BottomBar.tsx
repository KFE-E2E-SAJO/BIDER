'use client';

import { getCountdown } from '@/shared/lib/getCountdown';
import { Button } from '@repo/ui/components/Button/Button';
import { MessageSquareMore } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BidDialog } from '../../bids/ui/BidDialog';
import { BottomBarProps } from '../types';
import { toast } from '@repo/ui/components/Toast/Sonner';
import clsx from 'clsx';

const BottomBar = ({
  shortId,
  auctionEndAt,
  title,
  lastPrice,
  isSecret,
  minPrice,
}: BottomBarProps) => {
  const [countdown, setCountdown] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
  const [openBiddingSheet, setOpenBiddingSheet] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const update = () => setCountdown(getCountdown(auctionEndAt));
    update(); // 초기 렌더
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [auctionEndAt]);

  if (!hasMounted) return null;

  const buttonText = isSecret ? '시크릿 입찰하기' : '입찰하기';
  const bgColorClass = isSecret ? 'bg-event' : 'bg-main';
  const borderColorClass = isSecret ? 'border-event' : 'border-main';
  const iconColorClass = isSecret ? 'text-event' : 'text-main';

  return (
    <div className="bg-neutral-0 fixed bottom-0 left-0 z-50 h-[102px] w-full border-t border-neutral-100 px-[16px] pt-[15px]">
      <div className="flex items-center justify-between">
        <div>
          <div className="typo-subtitle-small-medium">입찰 마감 시간</div>
          <span className="text-sm text-neutral-700">{countdown}</span>
        </div>

        <div className="flex shrink-0 items-center gap-[12px]">
          <Button
            onClick={() => setOpenBiddingSheet(true)}
            disabled={countdown === '마감됨'}
            className={clsx('w-[142px]', bgColorClass)}
          >
            {buttonText}
          </Button>

          <Button
            variant="outline"
            className={clsx('w-[53px] border-[1.5px]', borderColorClass)}
            onClick={() => toast({ content: '준비 중인 기능입니다.' })}
          >
            <MessageSquareMore className={clsx(iconColorClass)} strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      <BidDialog
        shortId={shortId}
        auctionEndAt={auctionEndAt}
        title={title}
        lastPrice={lastPrice}
        open={openBiddingSheet}
        onOpenChange={setOpenBiddingSheet}
        isSecret={isSecret}
        minPrice={minPrice}
      />
    </div>
  );
};

export default BottomBar;
