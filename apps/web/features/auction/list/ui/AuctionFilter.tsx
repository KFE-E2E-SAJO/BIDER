import { AuctionFilter as AuctionFilterType } from '@/features/auction/list/types';
import AuctionTooltip from '@/features/auction/list/ui/AuctionTooltip';
import Checkbox from '@repo/ui/components/Checkbox/Checkbox';

import { useEffect, useState } from 'react';

interface AuctionFilterProps {
  setFilter: (filters: AuctionFilterType[]) => void;
}

const AuctionFilter = ({ setFilter }: AuctionFilterProps) => {
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
    const newFilters: AuctionFilterType[] = [];
    if (isDeadlineToday) newFilters.push('deadline-today');
    if (isExcludeEnded) newFilters.push('exclude-ended');
    setFilter(newFilters);
  }, [isDeadlineToday, isExcludeEnded]);

  return (
    <div className="p-box relative flex gap-[17px] pb-5">
      <div className="absolute">
        <AuctionTooltip />
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

export default AuctionFilter;
