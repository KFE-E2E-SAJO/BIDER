'use client';

import { getCountdown } from '@/shared/lib/getCountdown';
import { Button } from '@repo/ui/components/Button/Button';
import { MessageSquareMore } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BidDialog } from '../../bids/ui/BidDialog';
import { BottomBarProps } from '../types';
import { decodeShortId } from '@/shared/lib/shortUuid';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/model/authStore';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { string } from 'zod';

const BottomBar = ({ shortId, auctionEndAt, title, lastPrice, exhibitUserId }: BottomBarProps) => {
  const [countdown, setCountdown] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
  const [openBiddingSheet, setOpenBiddingSheet] = useState(false);
  const auctionId = decodeShortId(shortId);

  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    setHasMounted(true);

    const update = () => setCountdown(getCountdown(auctionEndAt));
    update(); // 초기 렌더
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [auctionEndAt]);

  if (!hasMounted) return null;

  // ✅ 채팅방 생성 및 이동 핸들러
  const handleStartChat = async () => {
    if (!userId) {
      toast({ content: '로그인이 필요합니다.' });
      return;
    }
    try {
      const res = await fetch(`/api/chat-rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auction_id: auctionId,
          exhibit_user_id: exhibitUserId,
          bid_user_id: userId,
        }),
      });
      if (!res.ok) {
        console.error('API 실패:', res.status, await res.text());
        toast({ content: `채팅방 생성에 실패했습니다. (코드: ${res.status})` });
        return;
      }

      const data = await res.json();
      console.log('채팅방 생성 응답:', data);
      const chatroomId = typeof data.chatRoomId === 'object' ? data.chatRoomId.id : data.chatRoomId;
      if (chatroomId) {
        router.push(`/chat/${chatroomId}`);
      } else {
        toast({ content: '채팅방 정보를 불러오지 못했습니다.' });
      }
    } catch (e) {
      toast({ content: '네트워크 오류가 발생했습니다.' });
    }
  };

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
            className="w-[142px]"
          >
            입찰하기
          </Button>
          <Button variant="outline" className="w-[53px] border-[1.5px]" onClick={handleStartChat}>
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
