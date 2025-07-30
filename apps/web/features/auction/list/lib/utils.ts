import { AuctionFilter, AuctionSort } from '@/features/auction/list/types';
import { CategoryValue } from '@/features/category/types';

export const auctionListQueryKey = (params: {
  search: string;
  cate: CategoryValue;
  sort: AuctionSort;
  filter: AuctionFilter[];
}) => {
  const filterKey = params.filter.join(',');
  return ['auctionList', params.search, params.cate, params.sort, filterKey];
};
