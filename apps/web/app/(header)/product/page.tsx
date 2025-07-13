'use client';

import { useCategoryStore } from '@/features/category/model/useCategoryStore';
import Category from '@/features/category/ui/Category';
import { useProductList } from '@/features/product/model/useProductList';
import useProductListErrorHandler from '@/features/product/model/useProductListErrorHandler';
import LocationPin from '@/features/product/ui/LocationPin';
import ProductList from '@/features/product/ui/ProductList';

import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';

const productListPage = () => {
  const cate = useCategoryStore((state) => state.selected);
  const userId = useAuthStore((state) => state.user?.id) as string;

  const { data, isLoading, error, isError } = useProductList({
    userId,
    cate,
  });

  useProductListErrorHandler(isError, error);

  let content = null;

  if (isLoading || !data) {
    content = <Loading />;
  } else {
    content = <ProductList data={data} />;
  }

  return (
    <>
      <Category type="inline" />
      <div className="p-box flex flex-1 flex-col">
        <LocationPin />
        {content}
      </div>
    </>
  );
};

export default productListPage;
