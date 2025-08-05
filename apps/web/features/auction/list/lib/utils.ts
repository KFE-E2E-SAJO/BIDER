import { AuctionListParams, Page } from '@/features/auction/list/types';

export const createAuctionListQueryKey = ({ cate, sort, filter, search }: AuctionListParams) => {
  const key = ['auctionList', cate, sort];

  if (filter?.length) {
    key.push([...filter].sort().join(','));
  }

  if (search?.trim()) {
    key.push(search.trim());
  }

  return key;
};

export const getListHeight = (page: Page, showList: boolean = false) => {
  switch (page) {
    case 'home':
      return showList ? '100%' : '0';
    case 'list':
      return 'calc(100vh - 326px)';
    case 'search':
      return 'calc(100vh - 172px)';
  }
};
