'use Client';

import { createPointByReason } from '@/features/point/api/createPointByReason';
import { supabase } from './supabaseClient';

export interface SignUpData {
  email: string;
  password: string;
  nickname: string;
}

export const sendEmailVerification = async (email: string) => {
  const getRedirectURL = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/auth/callback`;
    }
    const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return `${baseURL}/auth/callback`;
  };

  const redirectURL = getRedirectURL();
  console.log('redirectURL : ', redirectURL);

  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'temp_password',
    options: {
      emailRedirectTo: `${redirectURL}`,
    },
  });

  if (error) {
    // 일반적인 에러 처리
    return { success: false, error: error.message };
  }

  if (data?.user) {
    // 가짜 사용자 체크 (이미 존재하는 이메일)
    if (!data.user.identities || data.user.identities.length === 0) {
      return {
        success: false,
        error: '이미 가입된 이메일입니다.',
      };
    }

    // 진짜 신규 사용자
    return {
      success: true,
      message: '인증 메일이 발송되었습니다.',
    };
  }
};

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
