'use server';

import { BidHistoryWithUserNickname } from '@/entities/bidHistory/model/types';
import { createClient } from '@/shared/lib/supabase/server';

export default async function getBidHistory(
  auctionId: string
): Promise<BidHistoryWithUserNickname[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bid_history')
    .select(
      `
        *,
        bid_user_nickname:bid_user_id (
          nickname
        )
      `
    )
    .eq('auction_id', auctionId)
    .order('bid_price', { ascending: false });

  if (error || !data) {
    console.error('최고 입찰가 조회 실패:');
    throw new Error(error.message);
  }

  return data;
}
