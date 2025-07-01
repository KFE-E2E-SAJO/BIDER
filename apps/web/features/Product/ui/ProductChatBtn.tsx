'use client';

import { Button } from '@repo/ui/components/Button/Button';
import { usePathname, useRouter } from 'next/navigation';

interface ProductChatBtnProps {
  winnerId?: string | null;
  sellerId: string;
}

const ProductChatBtn = ({ winnerId, sellerId }: ProductChatBtnProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isBidPage = pathname === '/auction/bids';
  const isListingsPage = pathname === '/auction/listings';

  const handleChatClick = () => {
    isBidPage ? router.push(`/chat/${sellerId}`) : router.push(`/chat/${winnerId}`);
  };

  return (
    <>
      {isBidPage || isListingsPage ? (
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
