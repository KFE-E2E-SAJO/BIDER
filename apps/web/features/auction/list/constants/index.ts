import { AuctionListParams } from '@/features/auction/list/types';

export const DEFAULT_AUCTION_LIST_PARAMS: AuctionListParams = {
  cate: 'all',
  sort: 'latest',
  filter: ['exclude-ended'],
  search: '',
};
