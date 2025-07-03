'use client';

import { Button } from '@repo/ui/components/Button/Button';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/shared/lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/Dialog/Dialog';
import { useState } from 'react';
import { encodeUUID } from '@/shared/lib/shortUuid';

interface ProductActionBtnProps {
  winnerId?: string | null;
  sellerId: string;
  auctionStatus: string;
  isAwarded: boolean;
  itemId: string;
  isPending?: boolean;
  pendingId?: string | null;
}

const ProductActionBtn = ({
  winnerId,
  sellerId,
  auctionStatus,
  isAwarded,
  itemId,
  isPending,
  pendingId,
}: ProductActionBtnProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isBidPage = pathname === '/auction/bids';
  const isListingsPage = pathname === '/auction/listings';
  const [open, setOpen] = useState(false);

  const handleChatClick = () => {
    isBidPage ? router.push(`/chat/${sellerId}`) : router.push(`/chat/${winnerId}`);
  };
  const handleEditClick = () => {
    router.push(`/product/edit/${encodeUUID(itemId)}`);
  };
  const handleDialogClick = async () => {
    setOpen(true);
  };

  const handleDeleteClick = async () => {
    try {
      console.log('//// productId = ', itemId);

      const { data, error } = await supabase
        .from('product')
        .delete()
        .eq('product_id', itemId)
        .select(); // 👈 중요! 삭제된 row를 반환하게 강제함

      if (error) {
        console.error('[삭제 에러]', error);
        alert('삭제 중 오류: ' + error.message);
        return;
      }

      if (!data || data.length === 0) {
        console.warn('[삭제 실패] 조건에 맞는 row가 존재하지 않습니다.');
        alert('삭제 대상이 존재하지 않거나 이미 삭제되었습니다.');
        return;
      }

      console.log(data);

      alert('삭제가 완료되었습니다.');
      setOpen(false);
      router.push('/auction/listings');
      router.refresh();
    } catch (err) {
      console.error('[삭제 실패]', err);
      alert('삭제 중 오류가 발생했습니다: ' + (err as Error).message);
    }
  };

  return (
    <>
      {(isBidPage && auctionStatus == '경매 중') ||
      (isBidPage && isAwarded) ||
      (isListingsPage && auctionStatus == '경매 종료' && winnerId) ? (
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
