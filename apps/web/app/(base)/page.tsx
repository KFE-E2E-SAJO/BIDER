'use client';

import { useProductList } from '@/features/tempProduct/model/useProductList';
import LocationPin from '@/features/tempProduct/ui/LocationPin';
import ProductList from '@/features/tempProduct/ui/ProductList';
import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const HomePage = () => {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);

  const { data, isLoading, error } = useProductList({
    userId: userId as string,
  });

  useEffect(() => {
    if (!error) return;

    const message = (error as Error).message;

    if (message === '유저 위치 정보가 없습니다.') {
      alert(message);
      router.replace('/setLocation');
    } else {
      alert('로그인이 필요합니다.');
      router.replace('/login');
    }
  }, [error, router]);

  if (isLoading || error || !data) {
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
