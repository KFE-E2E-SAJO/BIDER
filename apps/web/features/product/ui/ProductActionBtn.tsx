'use client';

import { Button } from '@repo/ui/components/Button/Button';
import { usePathname, useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/Dialog/Dialog';
import { useState } from 'react';
import { encodeUUID } from '@/shared/lib/shortUuid';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { AUCTION_STATUS } from '@/shared/consts/auctionStatus';
import { getChatRoomLink } from '@/features/chat/room/model/getChatRoomLink';

interface ProductActionBtnProps {
  winnerId?: string | null;
  sellerId: string;
  auctionStatus: string;
  isAwarded: boolean;
  itemId: string;
  isPending?: boolean;
}

const ProductActionBtn = ({
  winnerId,
  sellerId,
  auctionStatus,
  isAwarded,
  itemId,
  isPending,
}: ProductActionBtnProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isBidPage = pathname === '/auction/bids';
  const isListingsPage = pathname === '/auction/listings';
  const [open, setOpen] = useState(false);

  const handleChatClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (sellerId && winnerId) {
      const chatRoomShortId = await getChatRoomLink(
        encodeUUID(itemId),
        encodeUUID(sellerId),
        encodeUUID(winnerId)
      );
      router.push(`/chat/${chatRoomShortId}`);
    }
  };
  const handleEditClick = () => {
    router.push(`/product/edit/${encodeUUID(itemId)}`);
  };
  const handleDialogClick = async () => {
    setOpen(true);
  };

  const handleDeleteClick = async () => {
    try {
      const res = await fetch('/api/auction/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: itemId }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || '삭제 실패');
      }

      toast({ content: '삭제가 완료되었습니다.' });

      setOpen(false);

      router.push('/auction/listings');
      router.refresh();
    } catch (err) {
      console.error('[삭제 실패]', err);
      toast({ content: '삭제 중 오류가 발생했습니다: ' + (err as Error).message });
    }
  };

  return (
    <>
      {(isBidPage && auctionStatus == AUCTION_STATUS.IN_PROGRESS) ||
      (isBidPage && isAwarded) ||
      (isListingsPage && auctionStatus == AUCTION_STATUS.ENDED && winnerId) ? (
        <Button
          onClick={handleChatClick}
          variant="secondary"
          className="typo-body-medium mt-[20px]"
        >
          {isBidPage ? '판매자' : '구매자'}와 채팅하기
        </Button>
      ) : null}
      {isListingsPage && isPending ? (
        <div className="flex items-center justify-between">
          <Button
            onClick={handleEditClick}
            variant="muted"
            className="typo-body-medium mt-[20px] w-[48%] border-neutral-400"
          >
            수정하기
          </Button>
          <Button
            onClick={handleDialogClick}
            variant="muted"
            className="typo-body-medium mt-[20px] w-[48%] border-neutral-400"
          >
            삭제하기
          </Button>
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>작업 선택</DialogTitle>
        </DialogHeader>
        <DialogContent showCloseButton={false}>
          <div className="typo-subtitle-small-medium py-[25px] text-center">
            출품한 상품이 삭제됩니다.
            <br />
            계속 하시겠습니까?
          </div>
          <div className="flex items-center justify-center border-t border-neutral-100">
            <Button onClick={() => setOpen(false)} variant="ghost" className="w-1/2">
              <span>취소</span>
            </Button>
            <Button onClick={handleDeleteClick} variant="ghost" className="text-danger w-1/2">
              <span>삭제하기</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductActionBtn;
