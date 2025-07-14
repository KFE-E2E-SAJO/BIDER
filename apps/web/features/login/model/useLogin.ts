'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/model/authStore';
import { supabase } from '@/shared/lib/supabaseForMiddleware';
import { getKoreanErrorMessage } from '../lib/getKoreanErrorMessage';
import { toast } from '@repo/ui/components/Toast/Sonner';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError('이메일을 입력해주세요');
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError('비밀번호를 입력해주세요');
      setIsLoading(false);
      return;
    }
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식을 입력해주세요');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setError(getKoreanErrorMessage(error.message));
        return;
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from(`profiles`)
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (profileError) {
          console.error('nickName, address 정보 가져오기 실패');
          return;
        }

        setUser({
          id: data.user.id,
          email: data.user.email!,
          nickName: profile.nickname,
          address: profile.address,
        });

        toast({ content: '로그인에 성공했습니다!' });

        router.refresh();
        router.push('/');
      }
    } catch (err) {
      setError('로그인 중 문제가 발생했습니다.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  };
};
