'use client';

import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { useAuctionList } from '@/features/auction/list/model/useAuctionList';
import {
  AuctionFilter as AuctionFilterType,
  AuctionListResponse,
  AuctionSort,
} from '@/features/auction/list/types';
import AuctionFilter from '@/features/auction/list/ui/AuctionFilter';
import AuctionList from '@/features/auction/list/ui/AuctionList';
import AuctionSortDropdown from '@/features/auction/list/ui/AuctionSortDropdown';
import { useCategoryStore } from '@/features/category/model/useCategoryStore';
import Category from '@/features/category/ui/Category';
import { LocationWithAddress } from '@/features/location/types';

import useVirtualInfiniteScroll from '@/features/auction/list/model/useVirtualInfiniteScroll';

import LocationPin from '@/features/location/ui/LocationPin';
import Loading from '@/shared/ui/Loading/Loading';

import { useMemo, useState } from 'react';
import useAuctionListErrorHandler from '@/features/auction/list/model/useAuctionListErrorHandler';

interface AuctionListClientPageProps {
  userLocation: LocationWithAddress;
}

const AuctionListClientPage = ({ userLocation }: AuctionListClientPageProps) => {
  const [sort, setSort] = useState<AuctionSort>(DEFAULT_AUCTION_LIST_PARAMS.sort);
  const [filter, setFilter] = useState<AuctionFilterType[]>(DEFAULT_AUCTION_LIST_PARAMS.filter);
  const cate = useCategoryStore((state) => state.selected ?? DEFAULT_AUCTION_LIST_PARAMS.cate);

  const params = useMemo(
    () => ({ ...DEFAULT_AUCTION_LIST_PARAMS, sort, filter, cate }),
    [sort, filter, cate]
  );

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAuctionList({
      params,
    });

  useAuctionListErrorHandler(isError, error);

  const auctionList = data?.pages.flatMap((page) => page.data) ?? [];

  const { parentRef, virtualRows, totalSize } = useVirtualInfiniteScroll({
    data: auctionList,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  let content = null;

  if (isLoading) {
    content = (
      <div className="flex flex-1">
        <Loading />
      </div>
    );
  } else {
    content = (
      <div
        ref={parentRef}
        style={{ height: 'calc(100vh - 326px)' }}
        className="p-box overflow-auto"
      >
        <AuctionList
          data={auctionList}
          virtualRows={virtualRows}
          totalSize={totalSize}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    );
  }

  return (
    <>
      <Category type="inline" />
      <div className="p-box my-[21px] flex items-center justify-between">
        <LocationPin address={userLocation.address} />
        <AuctionSortDropdown sort={sort} setSort={setSort} />
      </div>
      <AuctionFilter setFilter={setFilter} />

      {content}
    </>
  );
};

export default AuctionListClientPage;
