import { ProductSort } from '@/features/product/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/Select/Select';

interface ProductSortDropdownProps {
  setSort: (sort: ProductSort) => void;
}

const ProductSortDropdown = ({ setSort }: ProductSortDropdownProps) => {
  return (
    <Select defaultValue="latest" onValueChange={(value: ProductSort) => setSort(value)}>
      <SelectTrigger className="typo-caption-medium h-8 w-fit gap-[5px] rounded-[50px] border-none bg-neutral-100 px-[11px] py-[5px] text-neutral-800">
        <SelectValue placeholder="선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="latest">최신순</SelectItem>
        <SelectItem value="popular">인기순</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ProductSortDropdown;
