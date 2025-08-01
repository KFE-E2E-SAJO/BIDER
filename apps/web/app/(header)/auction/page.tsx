import AuctionListClientPage from '@/features/auction/list/ui/AuctionListClientPage';
import { getUserLocationAction } from '@/features/location/actions/getUserLocationAction';
import AuctionProvider from '@/features/auction/list/ui/AuctionProvider';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { createAuctionListQueryKey } from '@/features/auction/list/lib/utils';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { getAuctionListAction } from '@/features/auction/list/actions/getAuctionListAction';

const AuctionListPage = async () => {
  const initialPageParam = 0;
  const userLocation = await getUserLocationAction();

  if (!userLocation) return null;

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
      <AuctionListClientPage userLocation={userLocation} />
    </AuctionProvider>
  );
};

export default AuctionListPage;
