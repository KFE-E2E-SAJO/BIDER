'use client';

import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import dynamic from 'next/dynamic';
import Loading from '@/shared/ui/Loading/Loading';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface AuctionBidTabsProps {
  userId: string;
}

const BidListLazy = dynamic(() => import('@/features/auction/bids/ui/BidList'), { ssr: false });

const AuctionBidsTabs = ({ userId }: AuctionBidTabsProps) => {
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
    { value: 'all', label: '전체', content: <BidListLazy filter="all" userId={userId} /> },
    {
      value: 'progress',
      label: '경매 중',
      content: <BidListLazy filter="progress" userId={userId} />,
    },
    { value: 'win', label: '낙찰', content: <BidListLazy filter="win" userId={userId} /> },
    { value: 'fail', label: '패찰', content: <BidListLazy filter="fail" userId={userId} /> },
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

export default AuctionBidsTabs;
