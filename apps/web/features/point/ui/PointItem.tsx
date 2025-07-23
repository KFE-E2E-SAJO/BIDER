import React from 'react';

const PointItem = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="typo-caption-medium text-neutral-400">{'2025.05.14'}</div>
        <div>{'후기 10개 이상'}</div>
      </div>
      <div className="typo-subtitle-bold">
        <span className="text-main">+ </span>
        {'1,000'}
      </div>
    </div>
  );
};

export default PointItem;
