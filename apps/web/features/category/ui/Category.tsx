'use client';

import { categories, CategoryValue } from '@/features/category/types';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useCategoryStore } from '@/features/category/model/useCategoryStore';

interface CategoryProps {
  type?: 'inline' | 'grid';
}

const Category = ({ type = 'grid' }: CategoryProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected = useCategoryStore((state) => state.selected);
  const setSelected = useCategoryStore((state) => state.setSelected);

  useEffect(() => {
    const cate = (searchParams.get('cate') || 'all') as CategoryValue;
    setSelected(cate);
  }, [searchParams, setSelected]);

  const handleClick = (cate: CategoryValue) => {
    setSelected(cate);
    const params = new URLSearchParams(searchParams);
    params.set('cate', cate);

    const url = `/product?${params.toString()}`;

    if (type === 'grid') {
      router.push(url);
    } else {
      router.replace(url);
    }
  };

  const renderCategoryItem = (item: (typeof categories)[number]) => {
    const isSelected = item.value === selected;

    return (
      <div key={item.label} className="flex flex-col items-center gap-2">
        <div
          className={clsx(
            'relative flex h-[56px] w-[56px] items-center justify-center rounded-full bg-neutral-100',
            type === 'inline' && isSelected && 'border-main border-2'
          )}
        >
          <button
            onClick={() => handleClick(item.value)}
            className="flex flex-col items-center gap-2"
          >
            <Image src={item.src} alt={item.label} width={42} height={42} />
          </button>
        </div>
        <span className="typo-body-regular whitespace-nowrap text-center text-neutral-900">
          {item.label}
        </span>
      </div>
    );
  };

  if (type === 'grid') {
    return (
      <div className="my-auto px-8 md:px-12 lg:px-20 xl:px-32">
        <div className="grid grid-cols-4 gap-x-[26px] gap-y-[45px]">
          {categories.map(renderCategoryItem)}
        </div>
      </div>
    );
  }

  if (type === 'inline') {
    return (
      <div className="bg-neutral-0 sticky top-[67px] z-10 flex gap-[26px] overflow-x-scroll p-[15px]">
        {categories.map(renderCategoryItem)}
      </div>
    );
  }

  return null;
};

export default Category;
