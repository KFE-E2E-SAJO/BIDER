import { useQuery } from '@tanstack/react-query';
import { getAuctionDetail } from '../api/getAuctionDetail';
import { AuctionDetail } from '@/entities/auction/model/types';

export const useAuctionDetail = (shortId: string) => {
  return useQuery<AuctionDetail | null>({
    queryKey: ['auctionDetail', shortId],
    queryFn: () => getAuctionDetail(shortId),
    enabled: !!shortId,
    staleTime: 1000 * 60 * 1,
  });
};
