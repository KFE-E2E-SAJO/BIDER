'use client';

import { Button } from '@repo/ui/components/Button/Button';
import { usePathname, useRouter } from 'next/navigation';

interface ProductChatBtnProps {
  winnerId?: string | null;
  sellerId: string;
  auctionStatus: string;
  isAwarded: boolean;
}

const ProductChatBtn = ({ winnerId, sellerId, auctionStatus, isAwarded }: ProductChatBtnProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isBidPage = pathname === '/auction/bids';
  const isListingsPage = pathname === '/auction/listings';

  const handleChatClick = () => {
    isBidPage ? router.push(`/chat/${sellerId}`) : router.push(`/chat/${winnerId}`);
  };

  return (
    <>
      {(isBidPage && auctionStatus == '경매 중') ||
      (isBidPage && isAwarded) ||
      (isListingsPage && auctionStatus == '종료' && winnerId) ? (
        <Button
          onClick={handleChatClick}
          variant="secondary"
          className="typo-body-medium mt-[15px]"
        >
          {isBidPage ? '판매자' : '구매자'}와 채팅하기
        </Button>
      ) : null}
    </>
  );
};

export default ProductChatBtn;
