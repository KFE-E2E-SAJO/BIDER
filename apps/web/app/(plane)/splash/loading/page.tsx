'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/shared/ui/icon/Logo';

export default function SplashLoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/splash/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-main fixed left-[50%] top-0 z-50 flex h-screen w-full max-w-[600px] translate-x-[-50%] items-center justify-center">
      <div className="flex flex-1 scale-[2.5] items-center justify-center">
        <Logo variant="reversal" />
      </div>
    </div>
  );
}
