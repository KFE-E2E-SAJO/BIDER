import { AuctionListParams } from '@/features/auction/list/types';

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
