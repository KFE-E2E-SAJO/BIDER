'use client';

import { SignUpForm } from '@/features/signup/SignUpForm';
import '@repo/ui/styles.css';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  return (
    <div className="p-box">
      <ChevronLeft className="mt-[30px] cursor-pointer" onClick={() => router.back()} />
      <h1 className="typo-h3 mb-8 mt-28 text-center leading-[2.6rem]">회원가입</h1>
      <SignUpForm />
    </div>
  );
}
