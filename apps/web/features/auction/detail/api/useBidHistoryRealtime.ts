import { useEffect } from 'react';
import { anonSupabase } from '@/shared/lib/supabaseClient';
import { BidHistory, BidHistoryWithUserNickname } from '@/entities/bidHistory/model/types';
import { useQueryClient } from '@tanstack/react-query';
import { encodeUUID } from '@/shared/lib/shortUuid';

export function useBidHistoryRealtime({
  auctionId,
  onNewBid,
}: {
  auctionId: string;
  onNewBid: (newBid: BidHistoryWithUserNickname) => void;
}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = anonSupabase
      .channel('bid_history_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bid_history',
          filter: `auction_id=eq.${auctionId}`,
        },
        async (payload) => {
          const newBid = payload.new;

          queryClient.invalidateQueries({
            queryKey: ['auctionDetail', encodeUUID(auctionId)],
          });

          const { data: profiles, error } = await anonSupabase
            .from('profiles')
            .select('nickname')
            .eq('user_id', newBid.bid_user_id)
            .limit(1)
            .single();

          if (error || !profiles) return;

          const newBidWithNickname: BidHistoryWithUserNickname = {
            ...(newBid as BidHistory),
            bid_user_nickname: {
              nickname: profiles.nickname,
            },
          };

          onNewBid(newBidWithNickname);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [auctionId, onNewBid]);
}
