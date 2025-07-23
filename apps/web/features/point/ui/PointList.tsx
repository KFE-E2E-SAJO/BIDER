import React from 'react';
import { PointListProps } from '../types';
import PointItem from './PointItem';

const PointList = ({ filter }: PointListProps) => {
  return (
    <div className="mt-[28px] px-[34px]">
      <PointItem />
    </div>
  );
};

export default PointList;
