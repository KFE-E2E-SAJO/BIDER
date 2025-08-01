import { AuctionMarkerResponse } from '@/features/auction/list/types';

export const getAuctionMakers = async (): Promise<AuctionMarkerResponse[]> => {
  const res = await fetch(`/api/auction-map`);

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || '상품 위치 조회 실패');
  }

  const data = await res.json();
  return data;
};
