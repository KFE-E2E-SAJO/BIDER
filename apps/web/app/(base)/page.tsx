'use client';
import { useProductList } from '@/features/product/model/useProductList';
import LocationPin from '@/features/product/ui/LocationPin';
import ProductList from '@/features/product/ui/ProductList';
import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const HomePage = () => {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (userId === null) {
      router.replace('/login');
    }
  }, [userId, router]);

  if (!userId) return null;

  const { data, isLoading, error } = useProductList({
    userId,
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
