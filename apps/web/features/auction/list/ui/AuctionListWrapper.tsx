import { getAuctionListAction } from '@/features/auction/list/actions/getAuctionListAction';
import { auctionListQueryKey } from '@/features/auction/list/lib/utils';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { AuctionListParams } from '@/features/auction/list/types';

interface AuctionListWrapperProps {
  children: React.ReactNode;
  params?: AuctionListParams;
}

const AuctionListWrapper = async ({
  children,
  params = DEFAULT_AUCTION_LIST_PARAMS,
}: AuctionListWrapperProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: auctionListQueryKey(params),
    queryFn: ({ pageParam = 0 }) => getAuctionListAction({ offset: pageParam, params }),
    initialPageParam: 0,
  });

  const dehydratedState = dehydrate(queryClient);

  return <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>;
};

export default AuctionListWrapper;
