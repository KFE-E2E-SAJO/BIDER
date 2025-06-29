'use client';
import { Input } from '@repo/ui/components/Input/Input';
import { Button } from '@repo/ui/components/Button/Button';
import { useState, useEffect } from 'react';
import '@repo/ui/styles.css';
import { supabase } from '@/shared/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../packages/shared/store/auth/authStore';

export const LogInForm = () => {
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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      console.log(data, error);

      if (error) {
        setError(error.message);
        return;
      } else if (data.user) {
        setUser({ id: data.user.id, email: data.user.email! });
        router.push('/index'); //경로 수정해야함
      }
    } catch (err) {
      setError('로그인 중 문제가 발생했습니다.');
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
              required
            />
          </div>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="bg-main hover:bg-main-text text-neutral-0 w-full py-3"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </div>
      </form>

      <div className="m-5 flex items-center justify-center gap-2">
        <a href="#" className="flex font-normal text-neutral-700">
          아이디 찾기
        </a>
        <span className="flex font-normal text-neutral-700">|</span>
        <a href="#" className="flex text-neutral-400 text-neutral-700">
          비밀번호 찾기
        </a>
      </div>
    </div>
  );
};
