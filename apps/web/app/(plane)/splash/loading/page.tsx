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
    <div className="bg-main fixed inset-0 z-50 flex items-center justify-center">
      <div className="flex flex-1 scale-[2.5] items-center justify-center">
        <Logo variant="reversal" />
      </div>
    </div>
  );
}
