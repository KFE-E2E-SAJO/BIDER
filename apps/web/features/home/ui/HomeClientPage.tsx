'use client';

import LocationPin from '@/features/location/ui/LocationPin';
import Loading from '@/shared/ui/Loading/Loading';
import useVirtualInfiniteScroll from '@/features/auction/list/model/useVirtualInfiniteScroll';
import { useMemo, useState } from 'react';
import { Button } from '@repo/ui/components/Button/Button';
import { List, Map } from 'lucide-react';
import GoogleMapView from '@/features/location/ui/GoogleMapView';
import {
  AuctionListResponse,
  AuctionMarkerResponse,
  AuctionSort,
} from '@/features/auction/list/types';
import { useAuctionList } from '@/features/auction/list/model/useAuctionList';
import AuctionList from '@/features/auction/list/ui/AuctionList';
import AuctionSortDropdown from '@/features/auction/list/ui/AuctionSortDropdown';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { LocationWithAddress } from '@/features/location/types';
import useAuctionListErrorHandler from '@/features/auction/list/model/useAuctionListErrorHandler';

interface HomeClientPageProps {
  initialData: AuctionListResponse;
  userLocation: LocationWithAddress;
  auctionMarkers: AuctionMarkerResponse[];
}

const HomeClientPage = ({ initialData, userLocation, auctionMarkers }: HomeClientPageProps) => {
  const [sort, setSort] = useState<AuctionSort>(DEFAULT_AUCTION_LIST_PARAMS.sort);
  const [showMap, setShowMap] = useState(true);
  const params = useMemo(() => ({ ...DEFAULT_AUCTION_LIST_PARAMS, sort }), [sort]);

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAuctionList({
      params,
      initialData,
    });
  useAuctionListErrorHandler(isError, error);
  const auctionList = data?.pages.flatMap((page) => page.data) ?? [];

  const { parentRef, virtualRows, totalSize } = useVirtualInfiniteScroll({
    data: auctionList,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  let content = null;

  if (isLoading) {
    content = (
      <div className="flex flex-1">
        <Loading />
      </div>
    );
  } else {
    content = (
      <div
        ref={parentRef}
        style={{ height: showMap ? 'calc(100vh - 535px)' : 'calc(100vh - 235px)' }}
        className="p-box overflow-auto"
      >
        <AuctionList
          data={auctionList}
          virtualRows={virtualRows}
          totalSize={totalSize}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    );
  }

  return (
    <>
      {showMap && (
        <GoogleMapView
          mapId="auctionList"
          height="h-[300px]"
          location={userLocation.location}
          showMyLocation={false}
          markers={auctionMarkers}
          showMarkers={true}
        />
      )}

      <div className="p-box my-[21px] flex items-center justify-between">
        <LocationPin address={userLocation.address} />
        <AuctionSortDropdown sort={sort} setSort={setSort} />
      </div>
      {content}
      <Button
        shape="rounded"
        size="fit"
        className="typo-caption-medium fixed bottom-32 left-1/2 h-10 -translate-x-1/2 bg-neutral-900"
        onClick={() => setShowMap((prev) => !prev)}
      >
        {showMap ? <List size="18" strokeWidth={1.5} /> : <Map size="18" strokeWidth={1.5} />}
        {showMap ? '리스트로 보기' : '지도로 보기'}
      </Button>
    </>
  );
};

export default HomeClientPage;
