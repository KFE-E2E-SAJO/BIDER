'use client';

import { useParams } from 'next/navigation';
import { useTargetProduct } from '@/features/proposal/make/model/useTargetProduct';
import Image from 'next/image';

const TargetProduct = ({ userId }: { userId: string }) => {
  const params = useParams();
  const shortId = params?.shortId as string;

  const { data, isLoading, error } = useTargetProduct({ userId, shortId });

  if (isLoading || error || !data) return null;

  const bidPrices = data.bid_history?.map((bid: { bid_price: number }) => bid.bid_price);
  const highestPrice = bidPrices.length > 0 ? Math.max(...bidPrices) : data.min_price;

  return (
    <div className="p-box flex gap-[10px] border-b border-t border-neutral-100 py-[13px]">
      <div className="relative flex h-[37px] w-[37px] items-center justify-center overflow-hidden">
        <Image
          src={data.product.product_image[0].image_url}
          alt={data.product.title}
          width={37}
          height={37}
        />
      </div>
      <ul>
        <li className="typo-caption-regular">{data.product.title}</li>
        <li>
          <span className="pr-[4px] text-[10px] text-neutral-600">최고 입찰가</span>
          <span className="typo-caption-medium">{highestPrice.toLocaleString()}원</span>
        </li>
      </ul>
    </div>
  );
};
export default TargetProduct;
