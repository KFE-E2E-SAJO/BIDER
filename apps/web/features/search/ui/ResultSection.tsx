'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Loading from '@/shared/ui/Loading/Loading';
import { useProductList } from '@/features/product/model/useProductList';
import LocationPin from '@/features/product/ui/LocationPin';
import ProductList from '@/features/product/ui/ProductList';
import { toast } from '@repo/ui/components/Toast/Sonner';

interface ResultSectionProps {
  search: string;
  userId?: string;
}

const ResultSection = ({ search, userId }: ResultSectionProps) => {
  const router = useRouter();

  const { data, isLoading, error } = useProductList({
    userId: userId as string,
    search,
  });

  useEffect(() => {
    if (!error) return;

    const message = (error as Error).message;
    if (message === '유저 위치 정보가 없습니다.') {
      toast({ content: message });
      router.replace('/setLocation');
    } else {
      toast({ content: '로그인이 필요합니다.' });
      router.replace('/login');
    }
  }, [error, router]);

  if (isLoading && !data) return <Loading />;

  if (!search.trim()) {
    return <p className="mt-10 text-center text-neutral-500">검색어를 입력해주세요.</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">에러 발생: {(error as Error).message}</p>;
  }

  return (
    <>
      <LocationPin />
      <ProductList data={data ?? []} />
    </>
  );
};

export default ResultSection;
