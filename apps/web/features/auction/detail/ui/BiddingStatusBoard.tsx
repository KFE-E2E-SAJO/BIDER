import { Crown } from 'lucide-react';
import React from 'react';
import { BiddingStatusBoardProps } from '../types';
import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';

const BiddingStatusBoard = ({ data }: BiddingStatusBoardProps) => {
  if (data.length === 0) {
    return <div className="text-center">아직 입찰자가 없습니다. 첫 입찰자가 되어보세요!</div>;
  }

  return (
    <div>
      {data.slice(0, 5).map((bid, index) => (
        <div
          key={bid.bid_id}
          className={`flex justify-between border-b border-dashed border-neutral-300 px-[16px] py-[9px] ${
            index === 0 ? 'text-main typo-body-bold' : 'text-neutral-700'
          }`}
        >
          <div className="flex items-center gap-[6px]">
            {index === 0 && <Crown size={14} className="text-main fill-current" />}
            <div>{bid.bid_user_nickname.nickname}</div>
          </div>
          <div>{formatNumberWithComma(bid.bid_price)}원</div>
        </div>
      ))}
    </div>
  );
};

export default BiddingStatusBoard;
