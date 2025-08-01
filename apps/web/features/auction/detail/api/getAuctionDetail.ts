import { AuctionDetail } from '@/entities/auction/model/types';

export const getAuctionDetail = async (shortId: string): Promise<AuctionDetail | null> => {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const res = await fetch(`${baseURL}/api/auction/${shortId}`);

  if (!res.ok) {
    console.error('경매 상세 API 실패:', res.status);
    return null;
  }

  const data = await res.json();
  return data as AuctionDetail;
};
