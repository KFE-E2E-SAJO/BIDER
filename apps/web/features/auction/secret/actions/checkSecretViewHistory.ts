'use server';

import { SecretViewHistory } from '@/entities/auction/model/types';
import getUserId from '@/shared/lib/getUserId';
import { supabase } from '@/shared/lib/supabaseClient';

export default async function checkSecretViewHistory(
  auctionId: string
): Promise<SecretViewHistory> {
  const userId = getUserId();

  if (!userId) {
    return { hasPaid: false, isValid: false };
  }
  const { data, error } = await supabase
    .from('secret_bid_view_history')
    .select('viewed_at')
    .eq('auction_id', auctionId)
    .eq('user_id', userId)
    .order('viewed_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return { hasPaid: false, isValid: false };
  }

  const viewedAt = new Date(data.viewed_at);
  const now = new Date();
  const diffMs = now.getTime() - viewedAt.getTime();
  const isValid = diffMs < 10 * 60 * 1000; // 10분 이내

  return {
    hasPaid: true,
    isValid,
    viewedAt: viewedAt.toISOString(),
  };
}
