'use client';

import { useCategoryStore } from '@/features/category/model/useCategoryStore';
import { CategoryUi, CategoryValue } from '@/features/category/types';
import GridCategory from '@/features/category/ui/GridCategory';
import InlineCategory from '@/features/category/ui/InlineCategory';
import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryProps {
  type?: CategoryUi;
}

const Category = ({ type = 'grid' }: CategoryProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSelected = useCategoryStore((state) => state.setSelected);

  const handleClick = (cate: CategoryValue) => {
    setSelected(cate);
    const params = new URLSearchParams(searchParams);
    params.set('cate', cate);

    const url = `/product?${params.toString()}`;
    type === 'grid' ? router.push(url) : router.replace(url);
  };

  if (type === 'grid') return <GridCategory onSelect={handleClick} />;
  if (type === 'inline') return <InlineCategory onSelect={handleClick} />;

  return null;
};

export default Category;
