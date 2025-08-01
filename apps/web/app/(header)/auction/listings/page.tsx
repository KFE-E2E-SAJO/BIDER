import { Suspense } from 'react';
import AuctionListings from '@/features/auction/listings';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const SetAuctionListings = () => {
  return (
    <Suspense fallback={null}>
      <ReactQueryProvider>
        <AuctionListings />
      </ReactQueryProvider>
    </Suspense>
  );
};

export default SetAuctionListings;
