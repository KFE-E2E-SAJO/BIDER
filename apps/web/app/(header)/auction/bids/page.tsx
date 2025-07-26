import { Suspense } from 'react';
import AuctionBids from '@/features/auction/bids';

const SetAuctionBids = () => {
  return (
    <Suspense fallback={null}>
      <AuctionBids />
    </Suspense>
  );
};

export default SetAuctionBids;
