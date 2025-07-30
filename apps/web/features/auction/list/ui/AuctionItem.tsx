import { getCountdownWithColor } from '@/features/product/lib/utils';
import Image from 'next/image';
import { AUCTION_STATUS } from '@/shared/consts/auctionStatus';
import { AuctionList } from '@/features/auction/list/types';
import StatusBadge, { StatusType } from '@/shared/ui/badge/StatusBadge';

const AuctionItem = ({
  thumbnail,
  title,
  address,
  bidCount,
  bidPrice,
  auctionEndAt,
  auctionStatus,
}: AuctionList) => {
  const { text, color } =
    auctionStatus === AUCTION_STATUS.ENDED
      ? { text: '경매 종료', color: 'gray' }
      : getCountdownWithColor(auctionEndAt);

  const timeBadgeType = {
    gray: 'time-gray',
    orange: 'time-orange',
    blue: 'time-blue',
  }[color] as StatusType;

  return (
    <div className="flex gap-[19px]">
      <div className="relative h-[140px] w-[140px] overflow-hidden rounded">
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="140"
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
          <div>
            <span className="typo-body-bold">{bidPrice.toLocaleString()}</span>원
          </div>
          <div className="align-center flex flex-wrap gap-1">
            <StatusBadge type={timeBadgeType} label={text} />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AuctionItem;
