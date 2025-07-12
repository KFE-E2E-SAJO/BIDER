import { categories, CategoryValue } from '@/features/category/types';
import Image from 'next/image';

interface GridCategoryProps {
  onSelect: (cate: CategoryValue) => void;
}

const GridCategory = ({ onSelect }: GridCategoryProps) => {
  return (
    <div className="my-auto px-8 md:px-12 lg:px-20 xl:px-32">
      <div className="grid grid-cols-4 gap-x-[26px] gap-y-[45px]">
        {categories.map((item) => {
          return (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <div className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full bg-neutral-100">
                <button
                  onClick={() => onSelect(item.value)}
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
    </div>
  );
};

export default GridCategory;
