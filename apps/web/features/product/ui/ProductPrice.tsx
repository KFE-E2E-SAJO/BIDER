'use client';

import { usePathname } from 'next/navigation';

interface PriductPriceProps {
  minPrice: number;
  myBidPrice?: number;
}

const ProductPrice = ({ minPrice, myBidPrice }: PriductPriceProps) => {
  const pathname = usePathname();
  const isBidPage = pathname === '/auction/bids' ? true : false;

  const isMyBidHigher = myBidPrice !== undefined && myBidPrice >= minPrice;
  const isMinPriceHigher = myBidPrice !== undefined && minPrice > myBidPrice;

  return (
    <div className="mb-[10px]">
      {(isBidPage && myBidPrice) || (isBidPage && myBidPrice == 0) ? (
        <>
          <div className="typo-body-bold">
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
