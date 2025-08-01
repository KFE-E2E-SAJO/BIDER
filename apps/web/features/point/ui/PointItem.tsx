import React from 'react';
import { PointItemProps } from '../types';
import { formatDate } from '@/shared/lib/formatDate';
import { getPointReasonLabel } from '../lib/utils';
import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';

const PointItem = ({ data }: PointItemProps) => {
  const isEarn = Boolean(data.point > 0);
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="typo-caption-medium text-neutral-400">{formatDate(data.created_at)}</div>
        <div>{getPointReasonLabel(data.reason)}</div>
      </div>
      <div className="typo-subtitle-bold">
        <span className={isEarn ? 'text-main' : 'text-danger'}>{isEarn ? '+ ' : '- '}</span>
        {formatNumberWithComma(Math.abs(data.point))}
      </div>
    </div>
  );
};

export default PointItem;
