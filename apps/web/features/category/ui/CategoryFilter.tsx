import { categories, CategoryValue } from '@/features/category/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/Select/Select';

interface CategoryFilterProps {
  setCate: (cate: CategoryValue) => void;
}

const CategoryFilter = ({ setCate }: CategoryFilterProps) => {
  return (
    <Select defaultValue="all" onValueChange={(value: CategoryValue) => setCate(value)}>
      <SelectTrigger className="typo-caption-medium h-8 w-fit gap-[5px] rounded-[50px] border-none bg-neutral-100 px-[11px] py-[5px] text-neutral-800">
        <SelectValue placeholder="선택하세요" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((cate) => (
          <SelectItem key={cate.value} value={cate.value}>
            {cate.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryFilter;
