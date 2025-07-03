import { SignUpForm } from '../../features/signup/SignUpForm';
import { Button } from '@repo/ui/components/Button/Button';
import '@repo/ui/styles.css';

export default function SignUpPage() {
  return (
    <div className="m-3">
      <h1 className="mb-8 mt-28 text-center font-['Noto_Sans_KR'] text-[2rem] font-semibold leading-[2.6rem] text-[color:var(--252525,#252525)]">
        회원가입
      </h1>
      {/* <p className="text-center font-normal text-neutral-400">SNS 계정으로 간편하게 회원가입</p>

      <div className="m-3 flex gap-3">
        <Button className="flex-1 bg-white"></Button>
        <Button className="flex-1 bg-white"></Button>
      </div>

      <hr className="border-t-1 mb-10 mt-10 border-neutral-300"></hr> */}
      <SignUpForm />
    </div>
  );
}
