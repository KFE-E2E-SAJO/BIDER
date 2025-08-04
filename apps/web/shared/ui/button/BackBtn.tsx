'use client';

import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const BackBtn = () => {
  const pathname = usePathname();
  const router = useRouter();
  const handleBack = () => {
    if (pathname === '/bid/complete') {
      const lastAuctionId = localStorage.getItem('lastAuctionId');
      if (lastAuctionId) {
        router.replace(`/auction/${lastAuctionId}`);
      } else {
        router.replace('/'); // lastAuctionId없을경우 fallback
      }
    } else {
      window.history.back();
    }
  };
  return <ChevronLeft onClick={handleBack} className="cursor-pointer" />;
};

export default BackBtn;
