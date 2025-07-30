import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getAuctionDetail } from '../api/getAuctionDetail';
import AuctionDetailClient from './AuctionDetailClient';

const AuctionDetailPageContent = async ({ shortId }: { shortId: string }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['auctionDetail', shortId],
    queryFn: () => getAuctionDetail(shortId),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <AuctionDetailClient shortId={shortId} />
    </HydrationBoundary>
  );
};

export default AuctionDetailPageContent;
