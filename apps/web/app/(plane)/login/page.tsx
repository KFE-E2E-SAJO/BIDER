import { Button } from '@repo/ui/components/Button/Button';
import { LogInForm } from '@/features/login/ui/LogInForm';
import '@repo/ui/styles.css';
import Link from 'next/link';

export default function LogInPage() {
  return (
    <div className="z-50 m-5 space-y-6">
      <h1 className="mt-28 text-center text-[2rem] font-semibold leading-[2.6rem] text-neutral-900">
        로그인
      </h1>

      <LogInForm />

      {/* <hr className="border-t-2 border-neutral-300"></hr>
      <div className="mt-9 flex flex-col items-center justify-center">
        <span className="font-main-text mb-4 flex text-center font-medium">
          SNS계정으로
          <br />
          간편 로그인/회원가입
        </span>
        <div className="mb-8 flex w-full gap-2">
          <Button className="flex-1" />
          <Button className="flex-1" />
        </div>
      </div>
      <hr className="border-t-2 border-neutral-300"></hr> */}

      <div className="mt-8 flex items-center justify-center gap-1">
        <span className="font-main-text font-medium">아직 회원이 아니신가요?</span>
        <Link href="/signup" className="text-main flex font-medium underline">
          회원가입
        </Link>
      </div>
    </div>
  );
}
