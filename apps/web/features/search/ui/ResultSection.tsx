'use client';

import Loading from '@/shared/ui/Loading/Loading';
import { useProductList } from '@/features/product/model/useProductList';
import LocationPin from '@/features/product/ui/LocationPin';
import useProductListErrorHandler from '@/features/product/model/useProductListErrorHandler';
import { useAuthStore } from '@/shared/model/authStore';
import useVirtualInfiniteScroll from '@/features/product/model/useVirtualInfiniteScroll';
import ProductListScroll from '@/features/product/ui/ProductListScroll';

interface ResultSectionProps {
  search: string;
}

const ResultSection = ({ search }: ResultSectionProps) => {
  const userId = useAuthStore((state) => state.user?.id) as string;

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductList({ userId, search });

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
        style={{ height: 'calc(100vh - 138px)' }}
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
      <div className="p-box flex flex-col">
        <LocationPin />
      </div>
      {content}
    </>
  );
};

export default ResultSection;
