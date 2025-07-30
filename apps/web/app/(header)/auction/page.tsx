import { getAuctionListAction } from '@/features/auction/list/actions/getAuctionListAction';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import AuctionListClientPage from '@/features/auction/list/ui/AuctionListClientPage';
import { getUserLocationAction } from '@/features/location/actions/getUserLocationAction';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

const AuctionListPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['auctionList', DEFAULT_AUCTION_LIST_PARAMS],
    queryFn: ({ pageParam = 0 }) =>
      getAuctionListAction({ offset: pageParam, params: DEFAULT_AUCTION_LIST_PARAMS }),
    initialPageParam: 0,
  });

  const dehydratedState = dehydrate(queryClient);

  const userLocation = await getUserLocationAction();

  if (!userLocation) return null;

  return (
    <HydrationBoundary state={dehydratedState}>
      <AuctionListClientPage userLocation={userLocation} />
    </HydrationBoundary>
  );
};

export default AuctionListPage;
