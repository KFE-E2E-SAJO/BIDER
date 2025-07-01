'use client';

import StatusBadge, { StatusType } from '@/shared/ui/badge/StatusBadge';
import { usePathname } from 'next/navigation';

const ProductBadge = ({ text, color }: { text: string; color: string }) => {
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
    if (color === 'gray') {
      stateBadge = { type: 'state-gray', label: '패찰' };
    } else if (color === 'orange') {
      stateBadge = { type: 'state-green', label: '낙찰' };
    }
  }

  return (
    <div className="align-center flex flex-wrap gap-1">
      <StatusBadge type={timeBadgeType} label={text} />
      {stateBadge?.type && <StatusBadge type={stateBadge.type} label={stateBadge.label} />}
    </div>
  );
};

export default ProductBadge;
