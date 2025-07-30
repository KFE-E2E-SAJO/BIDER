import AuctionDetailPageContent from '@/features/auction/detail/ui/AuctionDetailPageContent';
import React from 'react';

const AuctionDetailPage = async ({ params }: { params: Promise<{ shortId: string }> }) => {
  const { shortId } = await params;
  return <AuctionDetailPageContent shortId={shortId} />;
};

export default AuctionDetailPage;
