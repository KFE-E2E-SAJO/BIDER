'use client';

import { useState, useEffect } from 'react';
import Logo from '@/shared/ui/icon/Logo';
import Link from 'next/link';
import { useSplashTimer } from '@/app/(plane)/splash/model/useSplashTimer';
import { SplashStartButton } from './ui/splashStartButton';

export default function SplashPage() {
  const [isMounted, setIsMounted] = useState(false);
  const isLoading = useSplashTimer();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading || !isMounted) {
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
          <SplashStartButton isMounted={isMounted}></SplashStartButton>
          <p className="typo-caption-regular text-center">
            이미 계정이 있나요?{' '}
            <Link href="/login" className="text-main cursor-pointer underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
