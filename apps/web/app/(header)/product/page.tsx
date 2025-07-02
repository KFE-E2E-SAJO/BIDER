'use client';

import { useCategoryStore } from '@/features/category/model/useCategoryStore';
import Category from '@/features/category/ui/Category';
import { useProductList } from '@/features/product/model/useProductList';
import LocationPin from '@/features/product/ui/LocationPin';
import ProductList from '@/features/product/ui/ProductList';
import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const productListPage = () => {
  const router = useRouter();
  const cate = useCategoryStore((state) => state.selected);
  const userId = useAuthStore((state) => state.user?.id);

  const { data, isLoading, error } = useProductList({
    userId: userId as string,
    cate,
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
  let content = null;

  if (isLoading) {
    content = <Loading />;
  } else if (error) {
    content = <p>에러 발생: {(error as Error).message}</p>;
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
