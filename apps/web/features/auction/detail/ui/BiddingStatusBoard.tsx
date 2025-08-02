import { Crown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BiddingStatusBoardProps } from '../types';
import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import { BidHistoryWithUserNickname } from '@/entities/bidHistory/model/types';
import { useBidHistoryRealtime } from '../api/useBidHistoryRealtime';

const BiddingStatusBoard = ({
  data,
  auctionId,
  onNewHighestBid,
  isSecret = false,
}: BiddingStatusBoardProps) => {
  const [bidData, setBidData] = useState<BidHistoryWithUserNickname[]>(data);
  const [latestBid, setLatestBid] = useState<BidHistoryWithUserNickname | null>(null);
  const pointColor = isSecret ? 'text-event' : 'text-main';

  useBidHistoryRealtime({
    auctionId: auctionId,
    onNewBid: (newBid) => {
      setBidData((prev) => [newBid, ...prev]);
      setLatestBid(newBid);
    },
  });

  useEffect(() => {
    if (!latestBid) return;

    onNewHighestBid?.(latestBid.bid_price);
  }, [latestBid]);

  if (bidData.length === 0) {
    return <div className="text-center">아직 입찰자가 없습니다. 첫 입찰자가 되어보세요!</div>;
  }

  return (
    <div>
      {bidData.slice(0, 5).map((bid, index) => (
        <div
          key={bid.bid_id}
          className={`flex justify-between border-b border-dashed border-neutral-300 px-[16px] py-[9px] ${
            index === 0 ? `${pointColor} typo-body-bold` : 'text-neutral-700'
          }`}
        >
          <div className="flex items-center gap-[6px]">
            {index === 0 && <Crown size={14} className={`${pointColor} fill-current`} />}
            <div>{bid.bid_user_nickname.nickname}</div>
          </div>
          <div>{formatNumberWithComma(bid.bid_price)}원</div>
        </div>
      ))}
    </div>
  );
};

export default BiddingStatusBoard;
