'use client';

import { useProductList } from '@/features/product/model/useProductList';
import useProductListErrorHandler from '@/features/product/model/useProductListErrorHandler';
import LocationPin from '@/features/product/ui/LocationPin';
import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';
import useVirtualInfiniteScroll from '@/features/product/model/useVirtualInfiniteScroll';
import ProductListScroll from '@/features/product/ui/ProductListScroll';

const HomePage = () => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductList({ userId });
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
      <div className="p-box">
        <LocationPin />
      </div>
      <div
        ref={parentRef}
        style={{ height: 'calc(100vh - 231px)' }}
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
