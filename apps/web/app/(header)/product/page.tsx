'use client';

import { useCategoryStore } from '@/features/category/model/useCategoryStore';
import Category from '@/features/category/ui/Category';
import { useProductList } from '@/features/product/model/useProductList';
import useProductListErrorHandler from '@/features/product/model/useProductListErrorHandler';
import useVirtualInfiniteScroll from '@/features/product/model/useVirtualInfiniteScroll';
import LocationPin from '@/features/product/ui/LocationPin';
import ProductListScroll from '@/features/product/ui/ProductListScroll';

import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';

const productListPage = () => {
  const cate = useCategoryStore((state) => state.selected);
  const userId = useAuthStore((state) => state.user?.id) as string;

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductList({ userId, cate });

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
        style={{ height: 'calc(100vh - 251px)' }}
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
      <Category type="inline" />
      <div className="p-box flex flex-col">
        <LocationPin />
      </div>
      {content}
    </>
  );
};

export default productListPage;
