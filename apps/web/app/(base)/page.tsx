import { getAuctionMarkersAction } from '@/features/auction/list/actions/getAuctionMakersAction';
import { getUserLocationAction } from '@/features/location/actions/getUserLocationAction';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getAuctionListAction } from '@/features/auction/list/actions/getAuctionListAction';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { createAuctionListQueryKey } from '@/features/auction/list/lib/utils';
import AuctionProvider from '@/features/auction/list/ui/AuctionProvider';
import HomeClientPage from '@/features/home/ui/HomeClientPage';

const HomePage = async () => {
  const initialPageParam = 0;
  const userLocation = await getUserLocationAction();
  const auctionMarkers = await getAuctionMarkersAction();

  if (!userLocation || !auctionMarkers) return null;

  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: createAuctionListQueryKey(DEFAULT_AUCTION_LIST_PARAMS),
    queryFn: ({ pageParam = 0 }) =>
      getAuctionListAction({ offset: pageParam, params: DEFAULT_AUCTION_LIST_PARAMS }),
    initialPageParam: initialPageParam,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <AuctionProvider dehydratedState={dehydratedState}>
      <HomeClientPage userLocation={userLocation} auctionMarkers={auctionMarkers} />
    </AuctionProvider>
  );
};

export default HomePage;
