'use Client';

import { createPointByReason } from '@/features/point/api/createPointByReason';
import { supabase } from './supabaseClient';

export interface SignUpData {
  email: string;
  password: string;
  nickname: string;
}

export const checkEmailVerification = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { isVerified: false, email: null };

    return {
      isVerified: !!user?.email_confirmed_at,
      email: user?.email || null,
    };
  } catch (error) {
    return { isVerified: false, email: null };
  }
};

export const completeSignUp = async ({
  email,
  password,
  nickname,
}: {
  email: string;
  password: string;
  nickname: string;
}) => {
  try {
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error: insertError } = await supabase.from('profiles').insert([
        {
          user_id: user.id,
          email,
          nickname,
        },
      ]);

      if (insertError) {
        return { success: false, error: insertError.message };
      }

      try {
        await createPointByReason('signup', user.id);
      } catch (error) {
        console.error('회원가입 포인트 지급 실패:', error);
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { success: !error, error: error?.message };
};
