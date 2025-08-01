import { AuctionSort } from '@/features/auction/list/types';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/Select/Select';

interface AuctionSortDropdownProps {
  sort: AuctionSort;
  setSort: (sort: AuctionSort) => void;
}

const AuctionSortDropdown = ({ setSort, sort }: AuctionSortDropdownProps) => {
  return (
    <Select
      defaultValue="latest"
      onValueChange={(value: AuctionSort) => setSort(value)}
      value={sort}
    >
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

export default AuctionSortDropdown;
