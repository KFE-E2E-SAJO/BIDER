'use client';

import { useProductList } from '@/features/product/model/useProductList';
import useProductListErrorHandler from '@/features/product/model/useProductListErrorHandler';
import LocationPin from '@/features/product/ui/LocationPin';
import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';
import useVirtualInfiniteScroll from '@/features/product/model/useVirtualInfiniteScroll';
import ProductListScroll from '@/features/product/ui/ProductListScroll';
import ProductSortDropdown from '@/features/product/ui/ProductSortDropdown';
import { useState } from 'react';
import { ProductSort } from '@/features/product/types';
import { Button } from '@repo/ui/components/Button/Button';
import { List, Map } from 'lucide-react';
import GoogleMapView from '@/features/location/ui/GoogleMapView';
import { useGetUserLocation } from '@/features/location/model/useGetUserLocation';
import { useProductMarkers } from '@/features/product/model/useProductMarkers';

const HomePage = () => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const [sort, setSort] = useState<ProductSort>('latest');
  const [showMap, setShowMap] = useState(true);
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductList({ userId, sort });
  useProductListErrorHandler(isError, error);
  const productList = data?.pages.flatMap((page) => page.data) ?? [];
  const { data: userLocationData, isLoading: isUserLocationLoading } = useGetUserLocation(userId);

  const { data: productMarkers = [], isLoading: isMarkerLoading } = useProductMarkers(userId);

  const { parentRef, virtualRows, totalSize } = useVirtualInfiniteScroll({
    data: productList,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isLoading || isUserLocationLoading || isMarkerLoading) return <Loading />;

  const location = userLocationData?.location;
  const address = userLocationData?.address;

  return (
    <>
      {showMap && location && (
        <GoogleMapView
          mapId="productList"
          height="h-[300px]"
          location={location}
          showMyLocation={false}
          markers={productMarkers}
          showMarkers={true}
        />
      )}
      <div className="p-box my-[21px] flex items-center justify-between">
        <LocationPin address={address} />
        <ProductSortDropdown setSort={setSort} />
      </div>
      <div
        ref={parentRef}
        style={{ height: showMap ? 'calc(100vh - 535px)' : 'calc(100vh - 235px)' }}
        className="p-box overflow-auto"
      >
        <ProductListScroll
          data={productList}
          virtualRows={virtualRows}
          totalSize={totalSize}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
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

export default HomePage;
