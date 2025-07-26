'use client';

import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UrlSyncTabsProps } from '@/features/auction/shared/types';

const UrlSyncTabs = ({ defaultValue, items, className }: UrlSyncTabsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabFromUrl = searchParams.get('tab') ?? defaultValue;
  const [tab, setTab] = useState(tabFromUrl);

  useEffect(() => {
    setTab(tabFromUrl);
  }, [tabFromUrl]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    router.replace(`${pathname}?tab=${newTab}`);
  };

  return <Tabs value={tab} onValueChange={handleTabChange} items={items} className={className} />;
};

export default UrlSyncTabs;
