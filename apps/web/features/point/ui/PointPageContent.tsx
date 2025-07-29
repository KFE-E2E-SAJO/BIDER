'use client';

import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import React from 'react';
import PointList from './PointList';
import { useAuthStore } from '@/shared/model/authStore';
import { useUserProfile } from '../model/useUserProfile';
import { useGetPointList } from '../model/useGetPointList';
import Loading from '@/shared/ui/Loading/Loading';
import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import { Button } from '@repo/ui/components/Button/Button';
import { createPointByReason } from '../api/createPointByReason';

const PointPageContent = () => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile(userId);
  const { data: pointList, isLoading: listLoading, error: listError } = useGetPointList(userId);

  const isLoading = profileLoading || listLoading;

  if (isLoading || !profile || !pointList) {
    return (
      <div className="mt-[28px] flex min-h-[400px] items-center justify-center px-[34px]">
        <Loading />
      </div>
    );
  }

  if (profileError) return <p>오류: {(profileError as Error).message}</p>;
  if (listError) return <p>오류: {(listError as Error).message}</p>;

  const items = [
    { value: 'all', label: '전체', content: <PointList filter="all" data={pointList ?? []} /> },
    { value: 'earn', label: '적립', content: <PointList filter="earn" data={pointList ?? []} /> },
    { value: 'use', label: '사용', content: <PointList filter="use" data={pointList ?? []} /> },
  ];

  return (
    <>
      <div className="flex items-center justify-between px-[34px] pb-[24px] pt-[35px]">
        <div className="text-neutral-600">내 포인트</div>
        <div className="typo-subtitle-bold">{formatNumberWithComma(profile.point)}</div>
      </div>
      <div className="mb-[20px] h-[8px] w-full bg-neutral-100"></div>
      <div className="p-box typo-subtitle-small-medium mb-[12px]">포인트 내역</div>
      <Tabs defaultValue="all" items={items} />
    </>
  );
};

export default PointPageContent;
