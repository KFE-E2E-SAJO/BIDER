import { Suspense } from 'react';
import AuctionBids from '@/features/auction/bids';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const SetAuctionBids = () => {
  return (
    <Suspense fallback={null}>
      <ReactQueryProvider>
        <AuctionBids />
      </ReactQueryProvider>
    </Suspense>
  );
};

export default SetAuctionBids;
