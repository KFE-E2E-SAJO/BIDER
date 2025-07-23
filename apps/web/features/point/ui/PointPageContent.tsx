import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import React from 'react';
import PointList from './PointList';

const PointPageContent = () => {
  const items = [
    { value: 'all', label: '전체', content: <PointList filter="all" /> },
    { value: 'save', label: '적립', content: <PointList filter="save" /> },
    { value: 'use', label: '사용', content: <PointList filter="use" /> },
  ];

  return (
    <>
      <div className="flex items-center justify-between px-[34px] pb-[24px] pt-[35px]">
        <div className="text-neutral-600">내 포인트</div>
        <div className="typo-subtitle-bold">{'2,580'}</div>
      </div>
      <div className="mb-[20px] h-[8px] w-full bg-neutral-100"></div>
      <div className="p-box typo-subtitle-small-medium mb-[12px]">포인트 내역</div>
      <Tabs defaultValue="all" items={items} />
    </>
  );
};

export default PointPageContent;
