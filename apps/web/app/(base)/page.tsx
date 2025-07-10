'use client';

import { useProductList } from '@/features/product/model/useProductList';
import useProductListErrorHandler from '@/features/product/model/useProductListErrorHandler';
import LocationPin from '@/features/product/ui/LocationPin';
import ProductList from '@/features/product/ui/ProductList';
import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';

const HomePage = () => {
  const userId = useAuthStore((state) => state.user?.id) as string;

  const { data, isLoading, isError, error } = useProductList({
    userId,
  });

  useProductListErrorHandler(isError, error);

  if (isLoading || !data) {
    return <Loading />;
  }

  return (
    <div className="p-box">
      <LocationPin />
      <ProductList data={data} />
    </div>
  );
};

export default HomePage;
