'use client';

import { Button } from '@repo/ui/components/Button/Button';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/shared/lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/DIalog/dialog';
import { useState } from 'react';

interface ProductChatBtnProps {
  winnerId?: string | null;
  sellerId: string;
  auctionStatus: string;
  isAwarded: boolean;
  isPending?: boolean;
  productId: string;
}

const ProductChatBtn = ({
  winnerId,
  sellerId,
  auctionStatus,
  isAwarded,
  isPending,
  productId,
}: ProductChatBtnProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isBidPage = pathname === '/auction/bids';
  const isListingsPage = pathname === '/auction/listings';
  const [open, setOpen] = useState(false);

  const handleChatClick = () => {
    isBidPage ? router.push(`/chat/${sellerId}`) : router.push(`/chat/${winnerId}`);
  };
  const handleEditClick = () => {
    router.push(`/product/edit/${productId}`);
  };
  const handleDialogClick = async () => {
    setOpen(true);
  };

  const handleDeleteClick = async () => {
    const confirmDelete = confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('product').delete().eq('product_id', productId);

    if (error) {
      alert('삭제 중 오류가 발생했습니다.');
      return;
    }

    alert('삭제가 완료되었습니다.');
    router.push('/auction/listings');
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

export default ProductChatBtn;
