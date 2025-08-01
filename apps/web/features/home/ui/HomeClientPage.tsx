'use client';

import LocationPin from '@/features/location/ui/LocationPin';
import Loading from '@/shared/ui/Loading/Loading';
import useVirtualInfiniteScroll from '@/features/auction/list/model/useVirtualInfiniteScroll';
import { useEffect, useState } from 'react';
import { Button } from '@repo/ui/components/Button/Button';
import { List, Map } from 'lucide-react';
import { AuctionMarkerResponse, AuctionSort } from '@/features/auction/list/types';
import { useAuctionList } from '@/features/auction/list/model/useAuctionList';
import AuctionList from '@/features/auction/list/ui/AuctionList';
import AuctionSortDropdown from '@/features/auction/list/ui/AuctionSortDropdown';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { LocationWithAddress } from '@/features/location/types';
import useAuctionListErrorHandler from '@/features/auction/list/model/useAuctionListErrorHandler';
import GoogleMapView from '@/features/location/ui/GoogleMapView';
import GoogleMapSkeleton from '@/features/location/ui/GoogleMapSkeleton';

interface HomeClientPageProps {
  userLocation: LocationWithAddress;
  auctionMarkers: AuctionMarkerResponse[];
}

const HomeClientPage = ({ userLocation, auctionMarkers }: HomeClientPageProps) => {
  const [hydrated, setHydrated] = useState(false);
  const [sort, setSort] = useState<AuctionSort>(DEFAULT_AUCTION_LIST_PARAMS.sort);
  const [showMap, setShowMap] = useState(true);
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAuctionList({ params: { ...DEFAULT_AUCTION_LIST_PARAMS, sort } });
  useAuctionListErrorHandler(isError, error);
  const auctionList = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    setHydrated(true);
  }, []);

  const { parentRef, virtualRows, totalSize } = useVirtualInfiniteScroll({
    data: auctionList,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  let content = null;

  if (isLoading || !hydrated) {
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
        <div className="h-[300px]">
          {hydrated ? (
            <GoogleMapView
              mapId="auctionList"
              height="h-[300px]"
              location={userLocation.location}
              showMyLocation={false}
              markers={auctionMarkers}
              showMarkers={true}
            />
          ) : (
            <GoogleMapSkeleton />
          )}
        </div>
      )}

      {hydrated && (
        <div className="p-box my-[21px] flex items-center justify-between">
          <LocationPin address={userLocation.address} />
          <AuctionSortDropdown sort={sort} setSort={setSort} />
        </div>
      )}

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
