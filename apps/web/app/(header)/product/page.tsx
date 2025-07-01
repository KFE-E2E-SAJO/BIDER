'use client';

import { useCategoryStore } from '@/features/category/model/useCategoryStore';
import Category from '@/features/category/ui/Category';
import { useProductList } from '@/features/product/model/useProductList';
import LocationPin from '@/features/product/ui/LocationPin';
import ProductList from '@/features/product/ui/ProductList';
import Loading from '@/shared/ui/Loading/Loading';

const productListPage = () => {
  const cate = useCategoryStore((state) => state.selected);

  const { data, isLoading, error } = useProductList({
    lat: 37.371017496651,
    lng: 127.00463877897,
    cate,
  });

  const products = data ?? [];
  let content = null;

  if (isLoading) {
    content = <Loading />;
  } else if (error) {
    content = <p>에러 발생: {(error as Error).message}</p>;
  } else {
    content = <ProductList data={products} />;
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
