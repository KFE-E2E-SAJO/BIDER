import { Crown } from 'lucide-react';
import React from 'react';

const BiddingStatusBoard = () => {
  if (false) {
    return <div className="text-center">아직 입찰자가 없습니다. 첫 입찰자가 되어보세요!</div>;
  }
  return (
    <div>
      <div className="text-main typo-body-bold flex justify-between border-b border-dashed border-neutral-300 px-[16px] py-[9px]">
        <div className="flex items-center gap-[6px]">
          <Crown size={14} className="text-main fill-current" />
          <div>하루얌</div>
        </div>
        <div>220,000원</div>
      </div>
      <div className="flex justify-between border-b border-dashed border-neutral-300 px-[16px] py-[9px] text-neutral-700">
        <div>{'애옹'}</div>
        <div>{'210,000원'}</div>
      </div>
    </div>
  );
};

export default BiddingStatusBoard;
