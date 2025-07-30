'use server';

import { createClient } from '@/shared/lib/supabase/server';

const getUserId = async (): Promise<string> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;
  if (!userId) {
    throw new Error('인증되지 않은 접근입니다.');
  }
  return userId;
};

export default getUserId;
