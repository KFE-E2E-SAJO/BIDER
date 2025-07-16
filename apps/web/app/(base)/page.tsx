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

const HomePage = () => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const [sort, setSort] = useState<ProductSort>('latest');
  const [showMap, setShowMap] = useState(false); // ✅ 지도 보기 토글 상태
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductList({ userId, sort });
  useProductListErrorHandler(isError, error);

  const productList = data?.pages.flatMap((page) => page.data) ?? [];

  const { parentRef, virtualRows, totalSize } = useVirtualInfiniteScroll({
    data: productList,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isLoading) return <Loading />;
  return (
    <>
      {showMap && <div className="h-[300px]">{/* <GoogleMap mapId="productList" /> */}</div>}
      <div className="p-box my-[21px] flex items-center justify-between">
        <LocationPin />
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
        className="bottom-30 text-caption fixed left-1/2 -translate-x-1/2 bg-neutral-900"
        onClick={() => setShowMap((prev) => !prev)}
      >
        {showMap ? (
          <>
            <List size="20" /> 리스트로 보기
          </>
        ) : (
          <>
            <Map size="20" /> 지도로 보기
          </>
        )}
      </Button>
    </>
  );
};

export default HomePage;
