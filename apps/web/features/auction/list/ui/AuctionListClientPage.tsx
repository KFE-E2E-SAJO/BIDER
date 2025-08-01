'use client';

import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { useAuctionList } from '@/features/auction/list/model/useAuctionList';
import { AuctionFilter as AuctionFilterType, AuctionSort } from '@/features/auction/list/types';
import AuctionFilter from '@/features/auction/list/ui/AuctionFilter';
import AuctionList from '@/features/auction/list/ui/AuctionList';
import AuctionSortDropdown from '@/features/auction/list/ui/AuctionSortDropdown';
import { useCategoryStore } from '@/features/category/model/useCategoryStore';
import Category from '@/features/category/ui/Category';
import { LocationWithAddress } from '@/features/location/types';

import useVirtualInfiniteScroll from '@/features/auction/list/model/useVirtualInfiniteScroll';

import LocationPin from '@/features/location/ui/LocationPin';
import { useState } from 'react';

interface AuctionListClientPageProps {
  userLocation: LocationWithAddress;
}

const AuctionListClientPage = ({ userLocation }: AuctionListClientPageProps) => {
  const [sort, setSort] = useState<AuctionSort>(DEFAULT_AUCTION_LIST_PARAMS.sort);
  const [filter, setFilter] = useState<AuctionFilterType[]>(DEFAULT_AUCTION_LIST_PARAMS.filter);
  const cate = useCategoryStore((state) => state.selected ?? DEFAULT_AUCTION_LIST_PARAMS.cate);

  return (
    <>
      <Category type="inline" />
      <div className="p-box my-[21px] flex items-center justify-between">
        <LocationPin address={userLocation.address} />
        <AuctionSortDropdown sort={sort} setSort={setSort} />
      </div>
      <AuctionFilter setFilter={setFilter} />

      <AuctionList sort={sort} filter={filter} cate={cate} />
    </>
  );
};

export default AuctionListClientPage;
