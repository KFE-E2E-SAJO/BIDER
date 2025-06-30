'use client';
import { sortCategories } from '@/features/category/lib/utils';
import { categories, CategoryValue } from '@/features/category/types';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface CategoryProps {
  type?: 'inline' | 'grid';
  selected?: CategoryValue;
}

const Category = ({ type = 'grid', selected = 'all' }: CategoryProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (cate: CategoryValue) => {
    const params = new URLSearchParams(searchParams);
    params.set('cate', cate);
    router.push(`/product?${params.toString()}`);
  };

  if (type === 'grid')
    return (
      <div className="my-auto px-8 md:px-12 lg:px-20 xl:px-32">
        <div className="grid grid-cols-4 gap-x-[26px] gap-y-[45px]">
          {categories.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <div className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full bg-neutral-100">
                <button
                  key={item.label}
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
          ))}
        </div>
      </div>
    );

  if (type === 'inline') {
    const sortedCategories = sortCategories(selected);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    }, [selected]);

    return (
      <div className="flex gap-[26px] overflow-scroll p-[15px]" ref={scrollRef}>
        {sortedCategories.map((item) => {
          const isSelected = item.value === selected;
          return (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <div
                className={`relative flex h-[56px] w-[56px] items-center justify-center rounded-full bg-neutral-100 ${
                  isSelected ? 'border-main border' : ''
                }`}
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
        })}
      </div>
    );
  }
};

export default Category;
