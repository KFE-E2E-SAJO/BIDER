import React from 'react';
import { PointListProps } from '../types';
import PointItem from './PointItem';
import { Point } from '@/entities/point/model/types';

const PointList = ({ filter, data }: PointListProps) => {
  const filteredData =
    filter === 'use'
      ? data.filter((item) => item.point < 0)
      : filter === 'earn'
        ? data.filter((item) => item.point > 0)
        : data;

  if (filteredData.length === 0) {
    return <p className="mt-[28px] px-[34px]">포인트 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="mt-[28px] px-[34px]">
      {filteredData?.map((item: Point, idx) => (
        <div key={item.point_id}>
          {idx !== 0 && <div className="my-[18px] h-[1px] w-full bg-neutral-100"></div>}
          <PointItem data={item} />
        </div>
      ))}
    </div>
  );
};

export default PointList;
