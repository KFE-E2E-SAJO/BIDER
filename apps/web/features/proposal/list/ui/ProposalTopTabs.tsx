'use client';

import { cn } from '@repo/ui/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ProposalTopTabs = () => {
  const pathname = usePathname();
  const isReceived = pathname === '/mypage/proposal/received';
  const isSent = pathname === '/mypage/proposal/sent';

  return (
    <div className="p-box flex items-baseline justify-between bg-white">
      <Link
        href="/mypage/proposal/received"
        className={cn(
          'typo-subtitle-small-medium w-1/2 py-[11px] text-center',
          isReceived
            ? 'border-b-2 border-neutral-900 text-neutral-900'
            : 'border-b border-neutral-300 text-neutral-600'
        )}
      >
        받은 제안
      </Link>
      <Link
        href="/mypage/proposal/sent"
        className={cn(
          'typo-subtitle-small-medium w-1/2 py-[11px] text-center',
          isSent
            ? 'border-b-2 border-neutral-900 text-neutral-900'
            : 'border-b border-neutral-300 text-neutral-600'
        )}
      >
        보낸 제안
      </Link>
    </div>
  );
};

export default ProposalTopTabs;
