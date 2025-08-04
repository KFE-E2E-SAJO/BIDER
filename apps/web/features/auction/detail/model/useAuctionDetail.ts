import { useQuery } from '@tanstack/react-query';
import { AuctionDetail } from '@/entities/auction/model/types';
import { getAuctionDetail } from '@/features/auction/detail/api/getAuctionDetail';

export const useAuctionDetail = (shortId: string) => {
  return useQuery<AuctionDetail | null>({
    queryKey: ['auctionDetail', shortId],
    queryFn: () => getAuctionDetail(shortId),
    enabled: !!shortId,
    staleTime: 1000 * 60 * 1,
  });
};
