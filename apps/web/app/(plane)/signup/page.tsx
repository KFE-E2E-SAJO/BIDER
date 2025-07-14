'use client';

import { SignUpForm } from '../../../features/signup/SignUpForm';
import { Button } from '@repo/ui/components/Button/Button';
import '@repo/ui/styles.css';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  return (
    <div className="p-box">
      <ChevronLeft className="mt-[30px] cursor-pointer" onClick={() => router.back()} />
      <h1 className="typo-h3 mb-8 mt-28 text-center leading-[2.6rem]">회원가입</h1>
      {/* <p className="">SNS 계정으로 간편하게 회원가입</p>

      <div className="m-3 flex gap-3">
        <Button className="flex-1"></Button>
        <Button className="flex-1"></Button>
      </div>

      <hr className="border-t-1 mb-10 mt-10 border-neutral-300"></hr> */}
      <SignUpForm />
    </div>
  );
}
