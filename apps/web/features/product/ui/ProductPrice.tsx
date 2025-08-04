'use client';

import { SecretBidPrice } from '@/features/auction/list/types';
import { usePathname } from 'next/navigation';

interface PriductPriceProps {
  minPrice: number | SecretBidPrice;
  myBidPrice?: number;
  isSecret: boolean;
}

const ProductPrice = ({ minPrice, myBidPrice, isSecret }: PriductPriceProps) => {
  const pathname = usePathname();
  const isBidPage = pathname === '/auction/bids' ? true : false;

  const isMyBidHigher =
    !isSecret && typeof minPrice === 'number' && myBidPrice !== undefined
      ? myBidPrice >= minPrice
      : false;
  const isMinPriceHigher =
    !isSecret && typeof minPrice === 'number' && myBidPrice !== undefined
      ? minPrice > myBidPrice
      : false;

  return (
    <div className="mb-[10px]">
      {(isBidPage && myBidPrice) || (isBidPage && myBidPrice == 0) ? (
        <>
          <div className="text-[16px] font-medium">
            내 입찰가{' '}
            <span className={`${isMyBidHigher ? 'text-main' : ''}`}>
              {myBidPrice.toLocaleString()}
            </span>
            <span className="typo-body-medium">원</span>
          </div>
          <div className="typo-caption-medium mt-[2px] text-neutral-600">
            최고 입찰가{' '}
            <span className={`${isMinPriceHigher ? 'text-main' : ''}`}>
              {minPrice.toLocaleString()}
            </span>
            원
          </div>
        </>
      ) : (
        <div>
          <span className="typo-body-bold">{minPrice.toLocaleString()}</span>원
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
