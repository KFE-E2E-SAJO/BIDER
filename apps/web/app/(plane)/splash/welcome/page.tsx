'use client';

import Logo from '@/shared/ui/icon/Logo';
import Link from 'next/link';
import { Button } from '@repo/ui/components/Button/Button';
import { useRouter } from 'next/navigation';

export default function SplashWelcomePage() {
  const router = useRouter();

  const handleStartClick = () => {
    router.push('/signup');
  };

  return (
    <div className="fixed left-[50%] top-0 z-50 flex h-screen w-full max-w-[600px] translate-x-[-50%] flex-col bg-white">
      <div className="flex-1"></div>

      <div className="flex items-center justify-center">
        <div className="scale-[2.5]">
          <Logo variant="blue" />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end">
        <div className="flex flex-col items-center gap-4 px-3 pb-16">
          <Button className="h-14 w-full" onClick={handleStartClick}>
            시작하기
          </Button>
          <p className="typo-body-regular text-center">
            이미 계정이 있나요?{' '}
            <Link href="/login" className="text-main typo-body-medium cursor-pointer underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
