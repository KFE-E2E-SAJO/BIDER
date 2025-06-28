import { supabase } from './supabaseClient';

export interface SignUpData {
  email: string;
  password: string;
  nickname: string;
}

export const sendEmailVerification = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'temporary_password',
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (data?.user) {
      console.log(data.user);
      if (data.user.email_confirmed_at) {
        return {
          success: false,
          error: '이미 가입된 이메일입니다. 로그인 해주세요.',
        };
      } else {
        return {
          success: false,
          error: '이미 인증 이메일이 발송된 이메일입니다. 이메일을 확인해주세요.',
        };
      }
    }

    if (error) {
      return {
        success: false,
        error: error.message || '이메일 인증 중 오류가 발생했습니다.',
      };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || '오류가 발생했습니다.' };
  }
};

export const checkEmailVerification = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
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

    const { error: insertError } = await supabase.from('user').insert([
      {
        email,
        nickname,
      },
    ]);

    if (insertError) {
      return { success: false, error: insertError.message };
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
