'use server';

import { SecretViewHistory } from '@/entities/auction/model/types';
import { createClient } from '@/shared/lib/supabase/server';
import { supabase } from '@/shared/lib/supabaseClient';

export default async function checkSecretViewHistory(
  auctionId: string
): Promise<SecretViewHistory> {
  const authSupabase = await createClient();

  const {
    data: { session },
  } = await authSupabase.auth.getSession();

  const userId = session?.user.id;

  console.log(userId, auctionId);
  if (!session?.user) {
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
