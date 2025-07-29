import { getAuctionListApi } from '@/features/auction/list/api/getAuctionListApi';
import {
  AuctionListError,
  AuctionListParams,
  AuctionListResponse,
} from '@/features/auction/list/types';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseAuctionListProps {
  params: AuctionListParams;
  initialData?: AuctionListResponse;
}

export const useAuctionList = (props: UseAuctionListProps) => {
  const { params } = props;
  return useInfiniteQuery<AuctionListResponse, AuctionListError>({
    queryKey: ['auctionList', params],
    queryFn: ({ pageParam = 0 }) => getAuctionListApi({ offset: pageParam as number, params }),
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 1,
    retry: 2,
  });
};
