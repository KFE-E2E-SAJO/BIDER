'use client';

import { encodeUUID } from '@/shared/lib/shortUuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/Dialog/Dialog';
import { useState } from 'react';
import { Button } from '@repo/ui/components/Button/Button';
import { useRouter } from 'next/navigation';

const ProposalActionButton = ({
  auctionId,
  userPoint,
}: {
  auctionId: string;
  userPoint: number;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (userPoint >= 100) {
      router.push(`/auction/${encodeUUID(auctionId)}/proposal`);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="typo-body-medium border border-neutral-300 px-[15px] py-[5px]"
      >
        제안하기
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>작업 선택</DialogTitle>
        </DialogHeader>
        <DialogContent showCloseButton={false}>
          <div className="typo-subtitle-small-medium py-[25px] text-center">
            100포인트 이상 있어야
            <br />
            가격 제안을 보낼 수 있어요.
          </div>
          <div className="relative flex items-center justify-center border-t border-neutral-100">
            <Button
              onClick={() => setOpen(false)}
              variant="ghost"
              className="typo-body-medium w-1/2"
            >
              <span>확인</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ProposalActionButton;
