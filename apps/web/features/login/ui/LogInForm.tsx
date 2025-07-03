'use client';
import { Input } from '@repo/ui/components/Input/Input';
import { Button } from '@repo/ui/components/Button/Button';
import { useState } from 'react';
import '@repo/ui/styles.css';
import { supabase } from '@/shared/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/model/authStore';
import { Mail, LockKeyhole } from 'lucide-react';
import Link from 'next/link';

export const LogInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  // Supabase 에러 메시지를 한국어로 변환
  const getKoreanErrorMessage = (errorMessage: string) => {
    if (errorMessage.includes('Invalid login credentials')) {
      return '이메일 또는 비밀번호가 올바르지 않습니다.';
    }
    if (errorMessage.includes('Email not confirmed')) {
      return '이메일 인증을 완료해주세요.';
    }
    if (errorMessage.includes('Too many requests')) {
      return '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
    }
    return '로그인 중 문제가 발생했습니다.';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

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

        setSuccessMessage('로그인에 성공했습니다!');
      }

      router.push('/');
    } catch (err) {
      setError('로그인 중 문제가 발생했습니다.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mt-20 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="이메일"
              className="flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              icon={<Mail size={20} />}
              inputStyle="pl-12 pr-11"
              required
            />
          </div>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              icon={<LockKeyhole size={20} />}
              inputStyle="pl-12 pr-11"
              required
            />
          </div>

          {error && <p className="rounded p-2 text-sm text-red-500">{error}</p>}

          {successMessage && <p className="rounded p-2 text-sm text-green-500">{successMessage}</p>}

          <Button
            type="submit"
            className="hover:bg-main-text text-neutral-0 w-full py-3"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </div>
      </form>

      <div className="m-5 flex items-center justify-center gap-2">
        <Link
          href="/find-id?type=email"
          className="typo-body-regular text-neutral-700 hover:text-neutral-900"
        >
          아이디 찾기
        </Link>
        <span className="typo-body-regular text-neutral-700">|</span>
        <Link
          href="/find-id?type=password"
          className="typo-body-regular text-neutral-700 hover:text-neutral-900"
        >
          비밀번호 찾기
        </Link>
      </div>
    </div>
  );
};
