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

interface ProductActionBtnProps {
  winnerId?: string | null;
  sellerId: string;
  auctionStatus: string;
  isAwarded: boolean;
  itemId: string;
  isPending?: boolean;
  auctionId?: string;
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
    // toast({ content: '준비 중인 기능입니다.' });
    // isBidPage ? router.push(`/chat/${sellerId}`) : router.push(`/chat/${winnerId}`);
    // 필수값 방어
    if (!itemId || !sellerId || !winnerId) {
      toast({ content: '낙찰자가 정해져야 채팅을 시작할 수 있습니다.' });
      console.error('누락 정보:', { itemId, sellerId, winnerId });
      return;
    }

    console.log('채팅 생성에 보낼 값:', {
      auction_id: itemId,
      exhibit_user_id: sellerId,
      bid_user_id: winnerId,
    });

    try {
      const res = await fetch('/api/chat-rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auction_id: itemId,
          exhibit_user_id: sellerId,
          bid_user_id: winnerId,
        }),
      });

      const data = await res.json();

      const chatroomId = data.chatroomId || data.chatroom_id || data.id;

      if (!res.ok || !chatroomId) {
        toast({ content: data.error || '채팅방 생성에 실패했습니다.' });
        console.log('Chat room creation response:', data);
        console.log('chatroomId:', chatroomId);
        return;
      }

      router.push(`/chat/${chatroomId}`);
    } catch (err) {
      toast({ content: '채팅방 생성 중 오류가 발생했습니다.' });
      console.error(err);
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
