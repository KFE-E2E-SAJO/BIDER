import { getAuctionListAction } from '@/features/auction/list/actions/getAuctionListAction';
import { getAuctionMarkersAction } from '@/features/auction/list/actions/getAuctionMakersAction';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import HomeClientPage from '@/features/home/ui/HomeClientPage';
import { getUserLocationAction } from '@/features/location/actions/getUserLocationAction';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

const HomePage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['auctionList', DEFAULT_AUCTION_LIST_PARAMS],
    queryFn: ({ pageParam = 0 }) =>
      getAuctionListAction({ offset: pageParam, params: DEFAULT_AUCTION_LIST_PARAMS }),
    initialPageParam: 0,
  });

  const dehydratedState = dehydrate(queryClient);

  const userLocation = await getUserLocationAction();
  const auctionMarkers = await getAuctionMarkersAction();

  if (!userLocation || !auctionMarkers) return null;

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeClientPage userLocation={userLocation} auctionMarkers={auctionMarkers} />
    </HydrationBoundary>
  );
};

export default HomePage;
