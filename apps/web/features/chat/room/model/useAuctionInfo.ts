import { useQuery } from '@tanstack/react-query';
import { getAuctionInfo } from '../api/getAuctionInfo';

export function useAuctionInfo(shortId: string) {
  return useQuery({
    queryKey: ['auctionInfo', shortId],
    queryFn: () => getAuctionInfo(shortId),
    staleTime: 1000 * 60 * 5,
  });
}
