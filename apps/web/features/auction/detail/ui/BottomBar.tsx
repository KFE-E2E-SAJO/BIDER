'use client';

import { getCountdown } from '@/shared/lib/getCountdown';
import { Button } from '@repo/ui/components/Button/Button';
import { MessageSquareMore } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BidDialog } from '../../bids/ui/BidDialog';
import { BottomBarProps } from '../types';
import { useRouter } from 'next/navigation';
import { getChatRoomLink } from '@/features/chat/room/model/getChatRoomLink';
import { encodeUUID } from '@/shared/lib/shortUuid';

const BottomBar = ({ shortId, auctionEndAt, title, lastPrice, exhibitUser }: BottomBarProps) => {
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
            className="w-[142px]"
          >
            입찰하기
          </Button>
          <Button variant="outline" className="w-[53px] border-[1.5px]" onClick={linkChatRoom}>
            <MessageSquareMore className="text-main" strokeWidth={1.5} />
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
      />
    </div>
  );
};

export default BottomBar;
