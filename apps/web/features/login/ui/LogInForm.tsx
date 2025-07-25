'use client';
import { Input } from '@repo/ui/components/Input/Input';
import { Button } from '@repo/ui/components/Button/Button';
import { Mail, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { useLogin } from '../model/useLogin';

export const LogInForm = () => {
  const { fullEmail, setEmail, password, setPassword, error, isLoading, handleSubmit } = useLogin();

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mt-20 space-y-[12px]">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="이메일"
              className="flex-1"
              value={fullEmail}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              icon={<Mail size={20} strokeWidth={1.5} />}
              inputStyle="px-[50px]"
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
              icon={<LockKeyhole size={20} strokeWidth={1.5} />}
              inputStyle="px-[50px]"
              required
            />
          </div>

          {error && <p className="rounded p-2 text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="hover:bg-main-text text-neutral-0 leading-1 w-full py-3 text-[16px] font-bold"
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
