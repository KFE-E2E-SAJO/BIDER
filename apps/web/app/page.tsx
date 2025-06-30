'use client';
import { useProductList } from '@/features/product/model/useProductList';
import ProductList from '@/features/product/ui/ProductList';
import Loading from '@/shared/ui/Loading/Loading';
import { Button } from '@repo/ui/components/Button/Button';
import { MapPin } from 'lucide-react';

//유저정보 받아서 lat,lng,위치 넣어줘야함

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
      <div className="my-[21px]">
        <Button shape="rounded" className="typo-caption-medium h-8 bg-neutral-900" size="fit">
          <MapPin size={14} />
          강남구 역삼동
        </Button>
      </div>

      <ProductList data={products} />
    </div>
  );
};

export default HomePage;
