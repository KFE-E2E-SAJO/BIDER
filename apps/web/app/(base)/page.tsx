'use client';
import { useProductList } from '@/features/product/model/useProductList';
import LocationPin from '@/features/product/ui/LocationPin';
import ProductList from '@/features/product/ui/ProductList';
import Loading from '@/shared/ui/Loading/Loading';

//유저정보 받아서 lat,lng대신 유저 id 넣는걸로 수정예정

const HomePage = () => {
  const { data, isLoading, error } = useProductList({
    lat: 37.371017496651,
    lng: 127.00463877897,
  });

  if (isLoading) return <Loading />;
  if (error) return <p>에러 발생: {(error as Error).message}</p>;
  const products = data ?? [];

  return (
    <div className="p-box">
      <LocationPin />

      <ProductList data={products} />
    </div>
  );
};

export default HomePage;
