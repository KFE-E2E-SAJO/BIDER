'use client';

import Loading from '@/shared/ui/Loading/Loading';
import { useProductList } from '@/features/product/model/useProductList';
import LocationPin from '@/features/product/ui/LocationPin';
import ProductList from '@/features/product/ui/ProductList';
import useProductListErrorHandler from '@/features/product/model/useProductListErrorHandler';
import { useAuthStore } from '@/shared/model/authStore';

interface ResultSectionProps {
  search: string;
}

const ResultSection = ({ search }: ResultSectionProps) => {
  const userId = useAuthStore((state) => state.user?.id) as string;

  const { data, isLoading, error, isError } = useProductList({
    userId,
    search,
  });

  useProductListErrorHandler(isError, error);

  let content = null;

  if (isLoading || !data) {
    content = <Loading />;
  } else if (!search.trim()) {
    content = <p className="mt-10 text-center text-neutral-500">검색어를 입력해주세요.</p>;
  } else {
    content = <ProductList data={data} />;
  }

  return (
    <>
      <LocationPin />
      {content}
    </>
  );
};

export default ResultSection;
