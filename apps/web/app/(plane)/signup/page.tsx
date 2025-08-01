'use client';

import { SignUpForm } from '@/features/signup/SignUpForm';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const router = useRouter();

  return (
    <ReactQueryProvider>
      <div className="p-box">
        <ChevronLeft
          className="mt-[30px] size-[30px] cursor-pointer stroke-[#8C8C8C] stroke-[1.5]"
          onClick={() => router.back()}
        />
        <h1 className="typo-h2 mb-[41px] mt-[56px] text-center">회원가입</h1>
        <SignUpForm />
      </div>
    </ReactQueryProvider>
  );
};

export default SignUpPage;
