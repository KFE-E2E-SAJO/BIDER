import { AuctionListParams } from '@/features/auction/list/types';

export const DEFAULT_AUCTION_LIST_PARAMS: AuctionListParams = {
  search: '',
  cate: 'all',
  sort: 'latest',
  filter: ['exclude-ended'],
};
