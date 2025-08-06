import { AuctionDetail } from '@/entities/auction/model/types';

export const getAuctionDetail = async (shortId: string): Promise<AuctionDetail | null> => {
  const baseURL = 'https://bider-git-test-bider-aac1a071.vercel.app/auction/k8KrqSd6VadqxdNUsSGD8E';

  const res = await fetch(`${baseURL}/api/auction/${shortId}`);

  if (!res.ok) {
    console.error('경매 상세 API 실패:', res.status);
    return null;
  }

  const data = await res.json();
  return data as AuctionDetail;
};
