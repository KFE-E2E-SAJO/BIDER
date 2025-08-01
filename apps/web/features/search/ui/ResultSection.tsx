'use client';

import { AuctionFilter as AuctionFilterType, AuctionSort } from '@/features/auction/list/types';
import { useState } from 'react';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';
import { CategoryValue } from '@/features/category/types';
import AuctionList from '@/features/auction/list/ui/AuctionList';
import dynamic from 'next/dynamic';
import LocationPin from '@/features/location/ui/LocationPin';
import AuctionFilter from '@/features/auction/list/ui/AuctionFilter';

const AuctionSortDropdown = dynamic(
  () => import('@/features/auction/list/ui/AuctionSortDropdown'),
  {
    ssr: false,
  }
);

const CategoryFilter = dynamic(() => import('@/features/category/ui/CategoryFilter'), {
  ssr: false,
});

interface ResultSectionProps {
  search: string;
  address: string;
}

const ResultSection = ({ search, address }: ResultSectionProps) => {
  const [sort, setSort] = useState<AuctionSort>(DEFAULT_AUCTION_LIST_PARAMS.sort);
  const [filter, setFilter] = useState<AuctionFilterType[]>(DEFAULT_AUCTION_LIST_PARAMS.filter);
  const [cate, setCate] = useState<CategoryValue>(DEFAULT_AUCTION_LIST_PARAMS.cate);
  const isEmpty = !search.trim();

  return (
    <>
      <div className="p-box my-[21px] flex items-center justify-between">
        <div className="flex gap-[11px]">
          <LocationPin address={address} />
          <CategoryFilter setCate={setCate} />
        </div>

        <AuctionSortDropdown sort={sort} setSort={setSort} />
      </div>
      <AuctionFilter setFilter={setFilter} />

      {isEmpty ? (
        <p className="mt-10 text-center text-neutral-500">검색어를 입력해주세요.</p>
      ) : (
        <AuctionList sort={sort} filter={filter} cate={cate} search={search} />
      )}
    </>
  );
};

export default ResultSection;
