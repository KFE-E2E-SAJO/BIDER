import { BidRequest, BidResponse } from '../types';

export const submitBid = async (shortId: string, bidData: BidRequest): Promise<BidResponse> => {
  const response = await fetch(`/api/auction/${shortId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bidData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || '입찰 중 오류가 발생했습니다.');
  }

  return result;
};
