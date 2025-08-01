'use client';

import { LogInForm } from '@/features/login/ui/LogInForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const LogInPage = () => {
  const router = useRouter();

  return (
    <ReactQueryProvider>
      <div className="p-box">
        <ChevronLeft
          className="mt-[30px] size-[30px] cursor-pointer stroke-[#8C8C8C] stroke-[1.5]"
          onClick={() => router.back()}
        />
        <h1 className="typo-h2 mb-[41px] mt-[56px] text-center">로그인</h1>

        <LogInForm />

        <div className="mt-8 flex items-center justify-center gap-1">
          <span className="typo-body-regular">아직 회원이 아니신가요?</span>
          <Link href="/signup" className="text-main typo-body-medium flex font-medium underline">
            회원가입
          </Link>
        </div>
      </div>
    </ReactQueryProvider>
  );
};

export default LogInPage;
