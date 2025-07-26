import { Suspense } from 'react';
import AuctionListings from '@/features/auction/listings';

const SetAuctionListings = () => {
  return (
    <Suspense fallback={null}>
      <AuctionListings />
    </Suspense>
  );
};

export default SetAuctionListings;
