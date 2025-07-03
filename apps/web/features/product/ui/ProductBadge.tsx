'use client';

import StatusBadge, { StatusType } from '@/shared/ui/badge/StatusBadge';
import { usePathname } from 'next/navigation';

interface ProductBadgeProps {
  text: string;
  color: string;
  auctionStatus: string;
  isAwarded: boolean;
  isPending?: boolean;
  bidCount: number;
}

const ProductBadge = ({
  text,
  color,
  auctionStatus,
  isAwarded,
  isPending,
  bidCount,
}: ProductBadgeProps) => {
  const pathname = usePathname();
  const isAuctionPage =
    pathname === '/auction/bids' || pathname === '/auction/listings' ? true : false;

  const timeBadgeType = {
    gray: 'time-gray',
    orange: 'time-orange',
    blue: 'time-blue',
  }[color] as StatusType;

  let stateBadge: { type: StatusType; label: string } | null = null;

  if (isAuctionPage) {
    if (auctionStatus == '경매 종료' && !isAwarded) {
      stateBadge = { type: 'state-gray', label: '패찰' };
    } else if (auctionStatus == '경매 종료' && isAwarded) {
      stateBadge = { type: 'state-green', label: '낙찰' };
    } else if (isPending) {
      stateBadge = { type: 'state-orange', label: '대기' };
    } else if (auctionStatus == '경매 종료' && bidCount == 0) {
      stateBadge = { type: 'state-gray', label: '유찰' };
    }
  }

  return (
    <div className="align-center flex flex-wrap gap-1">
      <StatusBadge type={timeBadgeType} label={text} />
      {stateBadge && <StatusBadge type={stateBadge.type} label={stateBadge.label} />}
    </div>
  );
};

export default ProductBadge;
