import Image from 'next/image';
import { AlarmClock } from 'lucide-react';
import { ProductForList } from '@/features/product/types';
import { getCountdownWithColor } from '@/features/product/lib/utils';

const ProductItem = ({
  thumbnail,
  title,
  address,
  bidCount,
  minPrice,
  auctionEndAt,
  auctionStatus,
}: ProductForList) => {
  const { text, color } =
    auctionStatus === 'end'
      ? { text: '경매 종료', color: 'gray' }
      : getCountdownWithColor(auctionEndAt);
  const statusClass = {
    gray: 'bg-neutral-100 text-neutral-700',
    orange: 'bg-warning-light text-warning-medium',
    blue: 'bg-main-lightest text-main',
  }[color];

  return (
    <div className="flex gap-[19px]">
      <div className="relative h-[140px] w-[140px] overflow-hidden rounded">
        <Image src={thumbnail} alt={title} fill objectFit="cover" objectPosition="center" />
      </div>

      <div className="flex flex-1 flex-col justify-between text-neutral-900">
        <div>
          <p className="typo-body-regular line-clamp-2">{title}</p>
          <span className="typo-caption-regular text-neutral-600">
            ${address} • 입찰 {bidCount}회
          </span>
        </div>

        <div>
          <p className="typo-body-bold mb-[8px]">
            {minPrice.toLocaleString()} <span className="typo-body-regular">원</span>
          </p>
          <div
            className={`flex w-fit items-center gap-[4px] px-[5px] py-[4px] text-[10px] ${statusClass}`}
          >
            <AlarmClock size={12} />
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
