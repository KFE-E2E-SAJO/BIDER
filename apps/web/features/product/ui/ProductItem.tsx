import { getCountdownWithColor } from '@/features/product/lib/utils';
import { ProductList } from '@/features/product/types';
import ProductBadge from '@/features/product/ui/ProductBadge';
import Image from 'next/image';
import ProductPrice from './ProductPrice';
import { AUCTION_STATUS } from '@/shared/consts/auctionStatus';

const ProductItem = ({
  thumbnail,
  title,
  address,
  bidCount,
  minPrice,
  myBidPrice,
  auctionEndAt,
  auctionStatus,
  isAwarded,
  isPending,
  winnerId,
}: ProductList) => {
  const { text, color } =
    auctionStatus === AUCTION_STATUS.ENDED
      ? { text: '경매 종료', color: 'gray' }
      : getCountdownWithColor(auctionEndAt);

  const badgeProps = { text, color, auctionStatus, isAwarded, isPending, bidCount, winnerId };

  return (
    <div className="flex gap-[19px]">
      <div className="relative h-[140px] w-[140px] overflow-hidden rounded">
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="140"
          fetchPriority="high"
          loading="lazy"
          className="object-cover object-center"
        />
      </div>

      <ul className="flex flex-1 flex-col justify-between text-neutral-900">
        <li>
          <p className="typo-body-regular line-clamp-2">{title}</p>
          <span className="typo-caption-regular text-neutral-600">
            {address} • 입찰 {bidCount}회
          </span>
        </li>

        <li className="mt-[30px]">
          <ProductPrice minPrice={minPrice} myBidPrice={myBidPrice} />
          <ProductBadge {...badgeProps} />
        </li>
      </ul>
    </div>
  );
};

export default ProductItem;
