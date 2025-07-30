import { getAuctionMakers } from '@/features/auction/list/api/getAuctionMakers';
import { AuctionMarkerResponse } from '@/features/auction/list/types';
import { useQuery } from '@tanstack/react-query';

export const useProductMarkers = () => {
  return useQuery<AuctionMarkerResponse[]>({
    queryKey: ['productMarkers'],
    queryFn: () => getAuctionMakers(),
  });
};
