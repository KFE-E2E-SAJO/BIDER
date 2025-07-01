import Image from 'next/image';
import { ProductForList } from '@/features/product/types';
import ProductBadge from './ProductBadge';
import { getCountdownWithColor } from '../lib/utils';
import ProductChatBtn from './ProductChatBtn';

const ProductItem = ({
  thumbnail,
  title,
  location,
  bidCount,
  minPrice,
  auctionEndAt,
  auctionStatus,
}: ProductForList) => {
  const { text, color } =
    auctionStatus === 'end'
      ? { text: '경매 종료', color: 'gray' }
      : getCountdownWithColor(auctionEndAt);

  return (
    <div>
      <div className="flex gap-[19px]">
        <div className="relative h-[140px] w-[140px] overflow-hidden rounded">
          <Image src={thumbnail} alt={title} fill objectFit="cover" objectPosition="center" />
        </div>

        <ul>
          <li>
            <p className="typo-body-regular line-clamp-2">{title}</p>
            <span className="typo-caption-regular text-neutral-600">
              {location} • 입찰 {bidCount}회
            </span>
          </li>

          <li className="mt-[30px]">
            <p className="typo-body-bold mb-[8px]">
              {minPrice.toLocaleString()} <span className="typo-body-regular">원</span>
            </p>
            <ProductBadge text={text} color={color} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductItem;
