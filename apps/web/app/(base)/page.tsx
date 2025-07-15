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

const HomePage = () => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const [sort, setSort] = useState<ProductSort>('latest');
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
      <div className="p-box my-[21px] flex items-center justify-between">
        <LocationPin />
        <ProductSortDropdown setSort={setSort} />
      </div>
      <div
        ref={parentRef}
        style={{ height: 'calc(100vh - 235px)' }}
        className="p-box overflow-auto"
      >
        <ProductListScroll
          data={productList}
          virtualRows={virtualRows}
          totalSize={totalSize}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
};

export default HomePage;
