import { supabase } from '@/shared/lib/supabaseClient';

interface GetProfileParams {
  userId: string;
}

export const getProfile = async ({ userId }: GetProfileParams) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('nickname, email, profile_img, address')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    throw new Error('프로필 정보를 불러오지 못했습니다.');
  }

  return data;
};
