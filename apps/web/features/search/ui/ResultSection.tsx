'use client';

import Loading from '@/shared/ui/Loading/Loading';
import { useProductList } from '@/features/product/model/useProductList';
import LocationPin from '@/features/product/ui/LocationPin';
import useProductListErrorHandler from '@/features/product/model/useProductListErrorHandler';
import { useAuthStore } from '@/shared/model/authStore';
import useVirtualInfiniteScroll from '@/features/product/model/useVirtualInfiniteScroll';
import ProductListScroll from '@/features/product/ui/ProductListScroll';
import { useState } from 'react';
import { ProductFilter as ProductFilterType, ProductSort } from '@/features/product/types';
import ProductSortDropdown from '@/features/product/ui/ProductSortDropdown';
import ProductFilter from '@/features/product/ui/ProductFilter';
import CategoryFilter from '@/features/category/ui/CategoryFilter';
import { CategoryValue } from '@/features/category/types';

interface ResultSectionProps {
  search: string;
}

const ResultSection = ({ search }: ResultSectionProps) => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const [sort, setSort] = useState<ProductSort>('latest');
  const [filter, setFilter] = useState<ProductFilterType[]>(['exclude-ended']);
  const [cate, setCate] = useState<CategoryValue>('all');

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductList({ userId, search, sort, filter, cate });

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
  } else if (!search.trim()) {
    content = <p className="mt-10 text-center text-neutral-500">검색어를 입력해주세요.</p>;
  } else {
    content = (
      <div
        ref={parentRef}
        style={{ height: 'calc(100vh - 173px)' }}
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
      <div className="p-box my-[21px] flex items-center justify-between">
        <div className="flex gap-[11px]">
          <LocationPin />
          <CategoryFilter setCate={setCate} />
        </div>

        <ProductSortDropdown setSort={setSort} />
      </div>
      <ProductFilter setFilter={setFilter} />
      {content}
    </>
  );
};

export default ResultSection;
