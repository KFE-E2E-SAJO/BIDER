import AuctionDetailPageContent from '@/features/auction/detail/ui/AuctionDetailPageContent';
import React from 'react';

const AuctionDetailPage = ({ params }: { params: Promise<{ shortId: string }> }) => {
  return <AuctionDetailPageContent params={params} />;
};

export default AuctionDetailPage;
