import { getCountdownWithColor } from '@/features/product/lib/utils';
import { ProductForList } from '@/features/product/types';
import ProductBadge from '@/features/product/ui/ProductBadge';
import Image from 'next/image';
import ProductPrice from './ProductPrice';

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
}: ProductForList) => {
  const { text, color } =
    auctionStatus === '경매 종료'
      ? { text: '경매 종료', color: 'gray' }
      : getCountdownWithColor(auctionEndAt);

  const badgeProps = { text, color, auctionStatus, isAwarded, isPending, bidCount, winnerId };

  return (
    <div className="flex gap-[19px]">
      <div className="relative h-[140px] w-[140px] overflow-hidden rounded">
        <Image src={thumbnail} alt={title} fill objectFit="cover" objectPosition="center" />
      </div>

      <ul className="flex flex-1 flex-col justify-between text-neutral-900">
        <li>
          <p className="typo-body-regular line-clamp-2">{title}</p>
          <span className="typo-caption-regular text-neutral-600">
            {address} {bidCount ? `• 입찰 ${bidCount}회` : null}
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
