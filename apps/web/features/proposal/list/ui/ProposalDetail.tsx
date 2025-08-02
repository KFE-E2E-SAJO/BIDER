'use client';

import { useAuthStore } from '@/shared/model/authStore';
import { useParams, useRouter } from 'next/navigation';
import { useProposalDetail } from '@/features/proposal/list/model/userProposalDetail';
import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { Button } from '@repo/ui/components/Button/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/Dialog/Dialog';
import { useState } from 'react';
import Image from 'next/image';
import useRespondProposal from '@/features/proposal/list/model/useRespondProposal';
import { toast } from '@repo/ui/components/Toast/Sonner';

const ProposalDetail = () => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const params = useParams();
  const router = useRouter();
  const proposalId = params?.proposalId as string;
  const { mutate: respondProposal } = useRespondProposal();

  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const { data, isLoading, error } = useProposalDetail({ userId, proposalId });

  if (isLoading || error || !data) return null;

  const bidPrices = data.auction.bid_history?.map((bid: { bid_price: number }) => bid.bid_price);
  const highestPrice = bidPrices.length > 0 ? Math.max(...bidPrices) : data.auction.min_price;

  const handleAcceptingModal = () => setAcceptModalOpen(true);
  const responseAccepting = () => {
    respondProposal(
      { proposalId, proposalStatus: 'accept', userId },
      {
        onSuccess: async () => {
          try {
            toast({ content: '제안이 수락되었습니다.' });

            await fetch('/api/alarm/proposal-accepted', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                proposalId,
                type: 'accepted',
                user_id: userId,
              }),
            });

            router.push('/mypage/proposal/received');
          } catch (error) {
            console.error('알림 전송 실패:', error);
          }
        },
        onError: (error) => {
          toast({ content: '수락 처리에 실패했습니다.' });
        },
      }
    );
  };
  const handleRejectingModal = () => setRejectModalOpen(true);
  const responseRejecting = () => {
    respondProposal(
      { proposalId, proposalStatus: 'reject', userId },
      {
        onSuccess: () => {
          toast({ content: '제안이 거절되었습니다.' });
          router.push('/mypage/proposal/received');
        },
        onError: (error) => {
          toast({ content: '거절 처리에 실패했습니다.' });
        },
      }
    );
  };

  return (
    <div>
      <div className="p-box flex gap-[10px] border-b border-t border-neutral-100 py-[13px]">
        <div className="relative w-[37px]">
          <Image
            src={data.auction.product.product_image[0].image_url}
            alt={data.auction.product.title}
            fill
            sizes=""
            className="rounded-[3px] object-cover object-center"
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

      <ul className="p-box bg-warning-light text-warning-medium typo-caption-medium fixed bottom-0 left-0 w-full list-inside list-disc pb-[75px] pt-[20px]">
        <li>제안을 수락하면 경매는 즉시 종료돼요.</li>
        <li>다른 입찰자는 더 이상 입찰할 수 없어요.</li>
        <li>수락 후에는 되돌릴 수 없어요.</li>
      </ul>

      <div className="p-box mt-[18px]">
        <div className="bg-main-lightest text-main-text flex items-baseline justify-center py-[15px]">
          <span className="pr-[7px]">받은 제안가</span>
          <div>
            <span className="typo-subtitle-bold">{data.proposed_price.toLocaleString()}</span>원
          </div>
        </div>
        <div className="mt-[8px] flex items-center justify-center gap-2">
          <Avatar src={data.proposer_id.profile_img} className="size-[15px]" />
          {data.proposer_id.nickname}
        </div>
        <div className="mt-[50px] flex items-center justify-between">
          <Button
            onClick={handleRejectingModal}
            type="submit"
            className="typo-body-medium h-[53px] w-[49%] bg-neutral-100 text-neutral-700"
          >
            거절하기
          </Button>
          <Button
            onClick={handleAcceptingModal}
            type="submit"
            className="typo-body-medium h-[53px] w-[49%]"
          >
            수락하기
          </Button>
        </div>
      </div>

      <Dialog open={acceptModalOpen} onOpenChange={setAcceptModalOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>작업 선택</DialogTitle>
        </DialogHeader>
        <DialogContent showCloseButton={false}>
          <div className="typo-subtitle-small-medium py-[25px] text-center">
            제안을 수락하시겠습니까?
          </div>
          <div className="relative flex items-center justify-center border-t border-neutral-100">
            <Button
              onClick={() => setAcceptModalOpen(false)}
              variant="ghost"
              className="typo-body-medium w-1/2"
            >
              <span>취소</span>
            </Button>
            <span className="translate-[-50%] absolute left-1/2 top-1/2 h-[18px] w-[1px] bg-neutral-100" />
            <Button
              variant="ghost"
              onClick={responseAccepting}
              className="text-main typo-body-medium w-1/2"
            >
              <span>수락하기</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>작업 선택</DialogTitle>
        </DialogHeader>
        <DialogContent showCloseButton={false}>
          <div className="typo-subtitle-small-medium py-[25px] text-center">
            제안을 거절하시겠습니까?
          </div>
          <div className="relative flex items-center justify-center border-t border-neutral-100">
            <Button
              onClick={() => setRejectModalOpen(false)}
              variant="ghost"
              className="typo-body-medium w-1/2"
            >
              <span>취소</span>
            </Button>
            <span className="translate-[-50%] absolute left-1/2 top-1/2 h-[18px] w-[1px] bg-neutral-100" />
            <Button
              variant="ghost"
              onClick={responseRejecting}
              className="text-danger typo-body-medium w-1/2"
            >
              <span>거절하기</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProposalDetail;
