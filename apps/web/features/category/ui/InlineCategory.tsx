import { useCategoryStore } from '@/features/category/model/useCategoryStore';
import { categories, CategoryValue } from '@/features/category/types';
import clsx from 'clsx';
import Image from 'next/image';

interface InlineCategoryProps {
  onSelect: (cate: CategoryValue) => void;
}

const InlineCategory = ({ onSelect }: InlineCategoryProps) => {
  const selected = useCategoryStore((state) => state.selected);

  return (
    <div className="bg-neutral-0 sticky top-[67px] z-10 flex gap-[26px] overflow-x-scroll p-[15px]">
      {categories.map((item) => {
        const isSelected = item.value === selected;
        return (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <div
              className={clsx(
                'relative flex h-[56px] w-[56px] items-center justify-center rounded-full bg-neutral-100',
                isSelected && 'border-main border-2'
              )}
            >
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
  );
};

export default InlineCategory;
