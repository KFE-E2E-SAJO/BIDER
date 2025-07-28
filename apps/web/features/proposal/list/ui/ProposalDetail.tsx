'use client';

import { useAuthStore } from '@/shared/model/authStore';
import { useParams } from 'next/navigation';
import { useProposalDetail } from '@/features/proposal/list/model/userProposalDetail';
import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { Star } from 'lucide-react';
import { Button } from '@repo/ui/components/Button/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/Dialog/Dialog';
import { useState } from 'react';

const ProposalDetail = () => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const params = useParams();
  const proposalId = params?.proposalId as string;

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const { data, isLoading, error } = useProposalDetail({ userId, proposalId });

  if (isLoading || error || !data) return null;

  const bidPrices = data.auction.bid_history?.map((bid: { bid_price: number }) => bid.bid_price);
  const highestPrice = bidPrices.length > 0 ? Math.max(...bidPrices) : data.auction.min_price;

  const handleAccepting = async () => {
    console.log('수락');
    setIsAcceptModalOpen(false);
  };

  return (
    <div>
      <div className="p-box flex gap-[10px] border-b border-t border-neutral-100 py-[13px]">
        <div className="w-[37px]">
          <img
            src={
              data.auction.product.product_image[data.auction.product.product_image.length - 1]
                .image_url
            }
          />
        </div>
        <ul>
          <li className="typo-caption-regular">{data.auction.product.title}</li>
          <li>
            <span className="pr-[4px] text-[10px] text-neutral-600">최고 입찰가</span>
            <span className="typo-caption-medium">{highestPrice.toLocaleString()}원</span>
          </li>
        </ul>
      </div>

      <div className="p-box mt-[18px]">
        <div className="bg-main-lightest text-main-text flex items-baseline justify-center py-[15px]">
          <span className="pr-[7px]">받은 제안가</span>
          <div>
            <span className="typo-subtitle-bold">38,000</span>원
          </div>
        </div>
        <div className="mt-[8px] flex items-center justify-center gap-4">
          <p className="flex items-center justify-center gap-2">
            <Avatar src={data.proposer_id.profile_img} className="size-[15px]" />
            {data.proposer_id.nickname}
          </p>
          <span className="h-[12px] w-[1px] bg-neutral-300"></span>
          <p className="flex items-center justify-center gap-1">
            <Star fill="var(--color-main)" stroke="0" size={15} />
            <span>4.3</span>
          </p>
        </div>
        <div className="mt-[50px] flex items-center justify-between">
          <Button
            type="submit"
            className="typo-body-medium h-[53px] w-[49%] bg-neutral-100 text-neutral-700"
          >
            거절하기
          </Button>
          <Button type="submit" className="typo-body-medium h-[53px] w-[49%]">
            수락하기
          </Button>
        </div>
      </div>

      <ul className="p-box bg-warning-light text-warning-medium typo-caption-medium fixed bottom-0 left-0 w-full list-inside list-disc pb-[75px] pt-[20px]">
        <li>제안을 수락하면 경매는 즉시 종료돼요.</li>
        <li>다른 입찰자는 더 이상 입찰할 수 없어요.</li>
        <li>수락 후에는 되돌릴 수 없어요.</li>
      </ul>

      <Dialog open={isAcceptModalOpen} onOpenChange={setIsAcceptModalOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>작업 선택</DialogTitle>
        </DialogHeader>
        <DialogContent showCloseButton={false}>
          <div className="typo-subtitle-small-medium py-[25px] text-center">
            제안을 수락하시겠습니까?
          </div>
          <div className="flex items-center justify-center border-t border-neutral-100">
            <Button onClick={() => setIsAcceptModalOpen(false)} variant="ghost" className="w-1/2">
              <span>취소</span>
            </Button>
            <Button onClick={handleAccepting} variant="ghost" className="text-main w-1/2">
              <span>수락하기</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>작업 선택</DialogTitle>
        </DialogHeader>
        <DialogContent showCloseButton={false}>
          <div className="typo-subtitle-small-medium py-[25px] text-center">
            제안을 거절하시겠습니까?
          </div>
          <div className="flex items-center justify-center border-t border-neutral-100">
            <Button onClick={() => setIsRejectModalOpen(false)} variant="ghost" className="w-1/2">
              <span>취소</span>
            </Button>
            <Button onClick={handleAccepting} variant="ghost" className="text-danger w-1/2">
              <span>수락하기</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProposalDetail;
