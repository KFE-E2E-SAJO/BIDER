import { getAuctionListApi } from '@/features/auction/list/api/getAuctionListApi';
import { createAuctionListQueryKey } from '@/features/auction/list/lib/utils';
import {
  AuctionListError,
  AuctionListParams,
  AuctionListResponse,
} from '@/features/auction/list/types';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseAuctionListProps {
  params: AuctionListParams;
}

export const useAuctionList = ({ params }: UseAuctionListProps) => {
  return useInfiniteQuery<AuctionListResponse, AuctionListError>({
    queryKey: createAuctionListQueryKey(params),
    queryFn: ({ pageParam = 0 }) => getAuctionListApi({ offset: pageParam as number, params }),
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 1,
    retry: 2,
  });
};
