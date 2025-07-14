import { Crown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BiddingStatusBoardProps } from '../types';
import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';
import { anonSupabase } from '@/shared/lib/supabaseClient';
import { BidHistory, BidHistoryWithUserNickname } from '@/entities/bidHistory/model/types';

const BiddingStatusBoard = ({ data }: BiddingStatusBoardProps) => {
  if (data.length === 0) {
    return <div className="text-center">아직 입찰자가 없습니다. 첫 입찰자가 되어보세요!</div>;
  }

  const [bidData, setBidData] = useState<BidHistoryWithUserNickname[]>(data);

  useEffect(() => {
    const channel = anonSupabase
      .channel('bid_history_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bid_history',
          filter: `auction_id=eq.${data[0]?.auction_id}`,
        },
        async (payload) => {
          const newBid = payload.new;
          const { data: profiles, error } = await anonSupabase
            .from('profiles')
            .select('nickname')
            .eq('user_id', newBid.bid_user_id)
            .limit(1)
            .single();

          if (error) {
            console.error('프로필 조회 실패:', error);
            return;
          }

          const newBidWithNickname = {
            ...(newBid as BidHistory),
            bid_user_nickname: { nickname: profiles.nickname },
          };

          setBidData((prev) => [newBidWithNickname, ...prev]);
        }
      )
      .subscribe((status) => {
        console.log('SUBSCRIBE STATUS:', status);
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div>
      {bidData.slice(0, 5).map((bid, index) => (
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
