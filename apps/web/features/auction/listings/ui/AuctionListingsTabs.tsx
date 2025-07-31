'use client';

import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import dynamic from 'next/dynamic';
import Loading from '@/shared/ui/Loading/Loading';
import { Suspense } from 'react';

export interface AuctionListingsTabsProps {
  userId: string;
}

const ListingsListLazy = dynamic(() => import('@/features/auction/listings/ui/ListingList'), {
  ssr: false,
});

const AuctionListingsTabs = ({ userId }: AuctionListingsTabsProps) => {
  const items = [
    { value: 'all', label: '전체', content: <ListingsListLazy filter="all" userId={userId} /> },
    {
      value: 'pending',
      label: '대기',
      content: <ListingsListLazy filter="pending" userId={userId} />,
    },
    {
      value: 'progress',
      label: '경매 중',
      content: <ListingsListLazy filter="progress" userId={userId} />,
    },
    { value: 'win', label: '낙찰', content: <ListingsListLazy filter="win" userId={userId} /> },
    { value: 'fail', label: '유찰', content: <ListingsListLazy filter="fail" userId={userId} /> },
  ];

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Tabs defaultValue="all" items={items} className="py-[16px]" />
      </Suspense>
    </>
  );
};

export default AuctionListingsTabs;
