import { ProductFilter as ProductFilterType } from '@/features/product/types';
import Checkbox from '@repo/ui/components/Checkbox/Checkbox';
import { useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/Tooltip/Tooltip';

interface ProductFilterProps {
  setFilter: (filters: ProductFilterType[]) => void;
}

const ProductFilter = ({ setFilter }: ProductFilterProps) => {
  const [isDeadlineToday, setIsDeadlineToday] = useState(false);
  const [isExcludeEnded, setIsExcludeEnded] = useState(true);

  const handleCheckboxChange = (checked: boolean, key: string) => {
    if (key === 'deadline-today') {
      setIsDeadlineToday(checked);
    } else if (key === 'exclude-ended') {
      setIsExcludeEnded(checked);
    }
  };

  useEffect(() => {
    const newFilters: ProductFilterType[] = [];
    if (isDeadlineToday) newFilters.push('deadline-today');
    if (isExcludeEnded) newFilters.push('exclude-ended');
    setFilter(newFilters);
  }, [isDeadlineToday, isExcludeEnded]);

  return (
    <div className="p-box relative flex gap-[17px] pb-5">
      <div className="absolute">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="opacity-0">툴팁</p>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="mt-1">
              오늘이 입찰 마지막 기회!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Checkbox
        id="deadlineToday"
        label="오늘 마감"
        value="deadline-today"
        onCheckedChange={(checked) => handleCheckboxChange(checked === true, 'deadline-today')}
        className="z-10"
      />

      <Checkbox
        id="excludeEnded"
        label="입찰 종료 제외"
        value="exclude-ended"
        defaultChecked
        onCheckedChange={(checked) => handleCheckboxChange(checked === true, 'exclude-ended')}
      />
    </div>
  );
};

export default ProductFilter;
