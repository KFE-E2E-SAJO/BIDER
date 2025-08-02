'use server';

import getUserId from '@/shared/lib/getUserId';
import { supabase } from '@/shared/lib/supabaseClient';

export async function saveSecretViewHistory(auctionId: string) {
  const user_id = await getUserId();
  if (!user_id) return { success: false };

  const { error } = await supabase.from('secret_bid_view_history').insert({
    auction_id: auctionId,
    user_id,
    viewed_at: new Date().toISOString(),
  });

  return { success: !error };
}
