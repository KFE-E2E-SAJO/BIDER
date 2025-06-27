import { SignUpForm } from '../../features/signup/SignUpForm';
import '@repo/ui/styles.css';

export default function SignUpPage() {
  return (
    <div>
      <h1 className="mb-8 mt-28 text-center font-['Noto_Sans_KR'] text-[2rem] font-semibold leading-[2.6rem] text-[color:var(--252525,#252525)]">
        회원가입
      </h1>
      <SignUpForm />
    </div>
  );
}
