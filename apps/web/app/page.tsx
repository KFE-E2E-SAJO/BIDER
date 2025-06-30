'use client';
import { useProductList } from '@/features/Product/model/useProductList';
import ProductList from '@/features/Product/ui/ProductList';
import Loading from '@/shared/ui/Loading/Loading';
import { Button } from '@repo/ui/components/Button/Button';
import { MapPin } from 'lucide-react';

const HomePage = () => {
  const { data, isLoading, error } = useProductList({
    lat: 37.4955804087497,
    lng: 127.028843531841,
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
