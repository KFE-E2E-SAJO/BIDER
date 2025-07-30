'use client';

import Loading from '@/shared/ui/Loading/Loading';
import { AuctionFilter as AuctionFilterType, AuctionSort } from '@/features/auction/list/types';
import useProductListErrorHandler from '@/features/auction/list/model/useAuctionListErrorHandler';
import useVirtualInfiniteScroll from '@/features/auction/list/model/useVirtualInfiniteScroll';
import { useMemo, useState } from 'react';
import CategoryFilter from '@/features/category/ui/CategoryFilter';
import { useAuctionList } from '@/features/auction/list/model/useAuctionList';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { CategoryValue } from '@/features/category/types';
import AuctionList from '@/features/auction/list/ui/AuctionList';
import AuctionFilter from '@/features/auction/list/ui/AuctionFilter';
import AuctionSortDropdown from '@/features/auction/list/ui/AuctionSortDropdown';

interface ResultSectionProps {
  search: string;
}

const ResultSection = ({ search }: ResultSectionProps) => {
  const [sort, setSort] = useState<AuctionSort>(DEFAULT_AUCTION_LIST_PARAMS.sort);
  const [filter, setFilter] = useState<AuctionFilterType[]>(DEFAULT_AUCTION_LIST_PARAMS.filter);

  const [cate, setCate] = useState<CategoryValue>(DEFAULT_AUCTION_LIST_PARAMS.cate);

  const params = useMemo(
    () => ({ ...DEFAULT_AUCTION_LIST_PARAMS, sort, filter, cate }),
    [sort, filter, cate]
  );

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAuctionList({
      params,
    });

  useProductListErrorHandler(isError, error);

  const auctionList = data?.pages.flatMap((page) => page.data) ?? [];

  const { parentRef, virtualRows, totalSize } = useVirtualInfiniteScroll({
    data: auctionList,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });
  let content = null;

  if (isLoading || !data) {
    content = (
      <div className="flex flex-1">
        <Loading />
      </div>
    );
  } else if (!search.trim()) {
    content = <p className="mt-10 text-center text-neutral-500">검색어를 입력해주세요.</p>;
  } else {
    content = (
      <div
        ref={parentRef}
        style={{ height: 'calc(100vh - 173px)' }}
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
      <div className="p-box my-[21px] flex items-center justify-between">
        <div className="flex gap-[11px]">
          <CategoryFilter setCate={setCate} />
        </div>

        <AuctionSortDropdown sort={sort} setSort={setSort} />
      </div>
      <AuctionFilter setFilter={setFilter} />
      {content}
    </>
  );
};

export default ResultSection;
