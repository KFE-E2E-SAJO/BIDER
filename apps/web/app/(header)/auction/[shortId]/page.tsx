import type { Metadata } from 'next';
import { getAuctionDetail } from '@/features/auction/detail/api/getAuctionDetail';
import AuctionDetailPageContent from '@/features/auction/detail/ui/AuctionDetailPageContent';
import React from 'react';

type Props = { params: { shortId: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shortId } = params;
  const auction = await getAuctionDetail(shortId).catch(() => null);

  if (!auction) {
    return {
      title: '가장 가까운 경매장 | Bider',
      description: '내 근처 가장 가까운 경매장, Bider',
    };
  }

  return {
    title: `${auction.product.title} | Bider`,
    description: `${auction.product.category} - ${auction.product.title} - ${auction.product.address}`,
    openGraph: {
      title: `${auction.product.title} | Bider`,
      description: `${auction.product.category} - ${auction.product.title} - ${auction.product.address}`,
      images: `${auction.product.product_image[0]?.image_url}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${auction.product.title} | Bider`,
      description: `${auction.product.category} - ${auction.product.title} - ${auction.product.address}`,
      images: `${auction.product.product_image[0]?.image_url}`,
    },
  };
}

const AuctionDetailPage = async ({ params }: { params: Promise<{ shortId: string }> }) => {
  const { shortId } = await params;
  return <AuctionDetailPageContent shortId={shortId} />;
};

export default AuctionDetailPage;
