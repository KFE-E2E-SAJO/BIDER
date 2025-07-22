'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/model/authStore';
import { createClient } from '@/shared/lib/supabase/client';
import { getKoreanErrorMessage } from '../lib/getKoreanErrorMessage';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { validateFullEmail } from '@/shared/lib/validation/email';
import { passwordSchema } from '@/shared/lib/validation/signupSchema';

export const useLogin = () => {
  const [fullEmail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const emailValid = validateFullEmail({ fullEmail: fullEmail });

    if (!emailValid.success) {
      setError(emailValid.error ?? '올바른 이메일 형식이 아닙니다');
      setIsLoading(false);
      return;
    }

    const passwordValid = passwordSchema.safeParse(password);

    if (!passwordValid.success) {
      setError(passwordValid.error.errors[0]?.message ?? '올바른 비밀번호 형식이 아닙니다');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullEmail, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(getKoreanErrorMessage(errData.error ?? '로그인에 실패했습니다'));
        setIsLoading(false);
        return;
      }

      const responseData = await res.json();

      const { user, session } = responseData;

      if (!user) {
        setError('유저 정보를 불러오지 못했습니다.');
        setIsLoading(false);
        return;
      }

      const supabase = createClient();

      if (session) {
        await supabase.auth.setSession(session);
      }

      setUser({
        id: user.id,
        email: user.email,
        nickName: user.nickName,
        address: user.address,
      });

      toast({ content: '로그인에 성공했습니다!' });

      router.push('/');
    } catch (err) {
      setError('로그인 중 문제가 발생했습니다.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fullEmail,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  };
};
