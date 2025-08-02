'use client';

import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import Loading from '@/shared/ui/Loading/Loading';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuctionListingsTabsProps } from '@/features/auction/listings/types';
import ListingList from '@/features/auction/listings/ui/ListingList';

const AuctionListingsTabs = ({ userId }: AuctionListingsTabsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(tabParam ?? 'all');

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    router.push(url.toString(), { scroll: false });
  };

  const items = [
    { value: 'all', label: '전체', content: <ListingList filter="all" userId={userId} /> },
    {
      value: 'pending',
      label: '대기',
      content: <ListingList filter="pending" userId={userId} />,
    },
    {
      value: 'progress',
      label: '경매 중',
      content: <ListingList filter="progress" userId={userId} />,
    },
    { value: 'win', label: '낙찰', content: <ListingList filter="win" userId={userId} /> },
    { value: 'fail', label: '유찰', content: <ListingList filter="fail" userId={userId} /> },
  ];

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Tabs
          defaultValue={currentTab}
          onValueChange={handleTabChange}
          items={items}
          className="py-[16px]"
        />
      </Suspense>
    </>
  );
};

export default AuctionListingsTabs;
