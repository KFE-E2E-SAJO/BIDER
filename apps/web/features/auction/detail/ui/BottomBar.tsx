'use client';

import { getCountdown } from '@/shared/lib/getCountdown';
import { Button } from '@repo/ui/components/Button/Button';
import { MessageSquareMore } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { BottomBarProps } from '@/features/auction/detail/types';
import { BidDialog } from '@/features/auction/bids/ui/BidDialog';
import { useRouter } from 'next/navigation';
import { getChatRoomLink } from '@/features/chat/room/model/getChatRoomLink';
import { encodeUUID } from '@/shared/lib/shortUuid';

const BottomBar = ({
  shortId,
  auctionEndAt,
  title,
  lastPrice,
  isSecret,
  minPrice,
  exhibitUser,
}: BottomBarProps) => {
  const router = useRouter();
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

  const linkChatRoom = async () => {
    const chatRoomShortId = await getChatRoomLink(
      shortId,
      encodeUUID(exhibitUser.user_id),
      'loginUser'
    );
    router.push(`/chat/${chatRoomShortId}`);
  };

  const buttonText = isSecret ? '시크릿 입찰하기' : '입찰하기';
  const bgColorClass = isSecret ? 'bg-event' : 'bg-main';
  const borderColorClass = isSecret ? 'border-event' : 'border-main';
  const iconColorClass = isSecret ? 'text-event' : 'text-main';

  return (
    <div className="bg-neutral-0 fixed bottom-0 left-[50%] z-50 h-[102px] w-full max-w-[600px] translate-x-[-50%] border-t border-neutral-100 px-[16px] pt-[15px]">
      <div className="flex items-center justify-between">
        <div>
          <div className="typo-subtitle-small-medium">입찰 마감 시간</div>
          {!hasMounted ? (
            <span className="text-sm text-neutral-700">-</span>
          ) : (
            <span className="text-sm text-neutral-700">{countdown}</span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-[12px]">
          <Button
            onClick={() => setOpenBiddingSheet(true)}
            disabled={countdown === '마감됨' || !hasMounted}
            className={clsx('w-[142px]', bgColorClass)}
          >
            {buttonText}
          </Button>

          <Button
            variant="outline"
            className={clsx('w-[53px] border-[1.5px]', borderColorClass)}
            onClick={linkChatRoom}
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
