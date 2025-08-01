'use client';

import LocationPin from '@/features/location/ui/LocationPin';
import Loading from '@/shared/ui/Loading/Loading';
import { useState } from 'react';
import { Button } from '@repo/ui/components/Button/Button';
import { List, Map } from 'lucide-react';
import { AuctionMarkerResponse, AuctionSort } from '@/features/auction/list/types';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { LocationWithAddress } from '@/features/location/types';
import GoogleMapSkeleton from '@/features/location/ui/GoogleMapSkeleton';
import dynamic from 'next/dynamic';

const GoogleMapView = dynamic(() => import('@/features/location/ui/GoogleMapView'), {
  ssr: false,
  loading: () => <GoogleMapSkeleton />,
});

const AuctionSortDropdown = dynamic(
  () => import('@/features/auction/list/ui/AuctionSortDropdown'),
  {
    ssr: false,
  }
);

const AuctionList = dynamic(() => import('@/features/auction/list/ui/AuctionList'), {
  ssr: false,
  loading: () => <Loading />,
});

interface HomeClientPageProps {
  userLocation: LocationWithAddress;
  auctionMarkers: AuctionMarkerResponse[];
}

const HomeClientPage = ({ userLocation, auctionMarkers }: HomeClientPageProps) => {
  const [sort, setSort] = useState<AuctionSort>(DEFAULT_AUCTION_LIST_PARAMS.sort);
  const [showMap, setShowMap] = useState(true);

  return (
    <>
      {showMap && (
        <div className="h-[300px]">
          <GoogleMapView
            mapId="auctionList"
            height="h-[300px]"
            location={userLocation.location}
            showMyLocation={false}
            markers={auctionMarkers}
            showMarkers={true}
          />
        </div>
      )}

      <div className="p-box my-[21px] flex items-center justify-between">
        <LocationPin address={userLocation.address} />
        <AuctionSortDropdown sort={sort} setSort={setSort} />
      </div>

      <AuctionList sort={sort} listOnly={!showMap} />

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
