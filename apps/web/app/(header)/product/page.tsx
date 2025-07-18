'use client';

import { useCategoryStore } from '@/features/category/model/useCategoryStore';
import Category from '@/features/category/ui/Category';
import { useProductList } from '@/features/product/model/useProductList';
import useProductListErrorHandler from '@/features/product/model/useProductListErrorHandler';
import useVirtualInfiniteScroll from '@/features/product/model/useVirtualInfiniteScroll';
import { ProductFilter as ProductFilterType, ProductSort } from '@/features/product/types';
import LocationPin from '@/features/product/ui/LocationPin';
import ProductFilter from '@/features/product/ui/ProductFilter';
import ProductListScroll from '@/features/product/ui/ProductListScroll';
import ProductSortDropdown from '@/features/product/ui/ProductSortDropdown';

import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';

import { Suspense, useState } from 'react';

const productListPage = () => {
  const cate = useCategoryStore((state) => state.selected);
  const userId = useAuthStore((state) => state.user?.id) as string;
  const [sort, setSort] = useState<ProductSort>('latest');
  const [filter, setFilter] = useState<ProductFilterType[]>(['exclude-ended']);

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductList({ userId, cate, sort, filter });

  useProductListErrorHandler(isError, error);

  const productList = data?.pages.flatMap((page) => page.data) ?? [];

  const { parentRef, virtualRows, totalSize } = useVirtualInfiniteScroll({
    data: productList,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  let content = null;

  if (isLoading || !data) {
    content = (
      <div className="flex flex-1">
        <Loading />
      </div>
    );
  } else {
    content = (
      <div
        ref={parentRef}
        style={{ height: 'calc(100vh - 286px)' }}
        className="p-box overflow-auto"
      >
        <ProductListScroll
          data={productList}
          virtualRows={virtualRows}
          totalSize={totalSize}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <Category type="inline" />
      </Suspense>
      <div className="p-box my-[21px] flex items-center justify-between">
        <LocationPin />
        <ProductSortDropdown setSort={setSort} />
      </div>
      <ProductFilter setFilter={setFilter} />

      {content}
    </>
  );
};

export default productListPage;
