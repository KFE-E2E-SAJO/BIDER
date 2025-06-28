'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/shared/ui/icon/Logo';
import { Button } from '@repo/ui/components/Button/Button';

export default function SplashPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const checkIsAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    return !!token;

    // 다른 방법들:
    // return document.cookie.includes('auth-token');
    // return !!sessionStorage.getItem('user');
  };

  const handleStartClick = () => {
    const isAuthenticated = checkIsAuthenticated();

    if (isAuthenticated) {
      router.push('/loca');
    } else {
      router.push('/sign');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-main fixed inset-0 z-50 flex items-center justify-center">
        <div className="flex flex-1 scale-[2.5] items-center justify-center">
          <Logo variant="reversal" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex-1"></div>

      <div className="flex items-center justify-center">
        <div className="scale-[2.5]">
          <Logo variant="blue" />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end">
        <div className="flex flex-col items-center gap-4 px-3 pb-16">
          <Button className="bg-main w-full" onClick={handleStartClick}>
            시작하기
          </Button>
          <p className="text-center font-medium">
            이미 계정이 있나요?{' '}
            <a href="/login" className="cursor-pointer text-blue-500 underline">
              로그인
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
