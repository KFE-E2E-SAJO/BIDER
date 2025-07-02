import { getCountdownWithColor } from '@/features/tempProduct/lib/utils';
import { ProductForList } from '@/features/tempProduct/types';
import ProductBadge from '@/features/tempProduct/ui/ProductBadge';
import Image from 'next/image';

const ProductItem = ({
  thumbnail,
  title,
  address,
  bidCount,
  minPrice,
  auctionEndAt,
  auctionStatus,
  isAwarded,
  isPending,
}: ProductForList) => {
  const { text, color } =
    auctionStatus === 'end'
      ? { text: '경매 종료', color: 'gray' }
      : getCountdownWithColor(auctionEndAt);

  const badgeProps = { text, color, auctionStatus, isAwarded, isPending, bidCount };

  return (
    <div className="flex gap-[19px]">
      <div className="relative h-[140px] w-[140px] overflow-hidden rounded">
        <Image src={thumbnail} alt={title} fill objectFit="cover" objectPosition="center" />
      </div>

      <ul className="flex flex-1 flex-col justify-between text-neutral-900">
        <li>
          <p className="typo-body-regular line-clamp-2">{title}</p>
          <span className="typo-caption-regular text-neutral-600">
            {address} • 입찰 {bidCount}회
          </span>
        </li>

        <li className="mt-[30px]">
          <p className="typo-body-bold mb-[8px]">
            {minPrice.toLocaleString()} <span className="typo-body-regular">원</span>
          </p>
          <ProductBadge {...badgeProps} />
        </li>
      </ul>
    </div>
  );
};

export default ProductItem;
