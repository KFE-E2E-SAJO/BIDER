'use client';

import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import { getCountdown } from '@/shared/lib/getCountDown';
import { Button } from '@repo/ui/components/Button/Button';
import { Dialog, DialogHeader, DialogTitle } from '@repo/ui/components/DIalog/dialog';
import { Input } from '@repo/ui/components/Input/Input';
import { MessageSquareMore } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface BottomBarProps {
  shortId: string;
  auctionEndAt: string | Date;
  title: string;
  lastPrice: string;
}

const BottomBar = ({ shortId, auctionEndAt, title, lastPrice }: BottomBarProps) => {
  const [countdown, setCountdown] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
  const [openBiddingSheet, setOpenBiddingSheet] = useState(false);
  const [biddingPrice, setBiddingPrice] = useState(formatNumberWithComma(Number(lastPrice) + 1000));
  const [biddingPriceWon, setBiddingPriceWon] = useState(biddingPrice + ' 원');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const update = () => setCountdown(getCountdown(auctionEndAt));
    update(); // 초기 렌더
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [auctionEndAt]);

  if (!hasMounted) return null;

  const handleBiddingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numericOnly = raw.replace(/\D/g, '');
    const formatted = formatNumberWithComma(numericOnly);
    setBiddingPrice(formatted);
    setBiddingPriceWon(formatted + ' 원');
  };

  const handleBidSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // 입찰가를 숫자로 변환
      const bidPriceNumber = Number(biddingPrice.replace(/,/g, ''));

      if (!bidPriceNumber || bidPriceNumber <= 0) {
        alert('올바른 입찰가를 입력해주세요.');
        return;
      }

      // 서버에 입찰 요청
      const response = await fetch(`/api/product/${shortId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bidPrice: bidPriceNumber,
          userId: '0f521e94-ed27-479f-ab3f-e0c9255886c5', // 임시 사용자 ID
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || '입찰 중 오류가 발생했습니다.');
        return;
      }

      // 입찰 성공
      alert(result.message || '입찰이 완료되었습니다!');
      setOpenBiddingSheet(false);

      // 페이지 새로고침 또는 데이터 재로드
      window.location.reload();
    } catch (error) {
      console.error('입찰 요청 오류:', error);
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
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
          <Button variant="outline" className="w-[53px]">
            <MessageSquareMore className="text-main" />
          </Button>
        </div>
      </div>

      <Dialog open={openBiddingSheet} onOpenChange={setOpenBiddingSheet}>
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
    </div>
  );
};

export default BottomBar;
