'use client';

import { cn } from '@repo/ui/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AuctionTopTabs = () => {
  const pathname = usePathname();
  const isBids = pathname === '/auction/bids';
  const isListings = pathname === '/auction/listings';

  return (
    <div className="p-box flex items-baseline justify-between bg-white">
      <Link
        href="/auction/bids"
        className={cn(
          'typo-subtitle-small-medium w-1/2 py-[11px] text-center',
          isBids
            ? 'border-b-2 border-neutral-900 text-neutral-900'
            : 'border-b border-neutral-300 text-neutral-600'
        )}
      >
        입찰 내역
      </Link>
      <Link
        href="/auction/listings"
        className={cn(
          'typo-subtitle-small-medium w-1/2 py-[11px] text-center',
          isListings
            ? 'border-b-2 border-neutral-900 text-neutral-900'
            : 'border-b border-neutral-300 text-neutral-600'
        )}
      >
        출품 내역
      </Link>
    </div>
  );
};

export default AuctionTopTabs;
