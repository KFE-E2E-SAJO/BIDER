'use client';
import { Input } from '@repo/ui/components/Input/Input';
import { Button } from '@repo/ui/components/Button/Button';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  sendEmailVerification,
  checkEmailVerification,
  completeSignUp,
} from '../../shared/lib/auth';
import '@repo/ui/styles.css';

export const SignUpForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [customDomain, setCustomDomain] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');

  const [isEmailSent, setIsEmailSent] = useState<boolean>(false); //이메일 보냇는지 여부
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false); //인증 완료 됬는지
  const [verifiedEmail, setVerifiedEmail] = useState<string>(''); //인증완료된 이메일
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<string>('');
  const [domainError, setDomainError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPwError] = useState<string>('');
  const [nicknameError, setNicknameError] = useState<string>('');

  useEffect(() => {
    const checkVerificationStatus = async () => {
      const isVerifiedFromCallback = searchParams.get('verified') === 'true';

      if (isVerifiedFromCallback) {
        const { isVerified, email: userEmail } = await checkEmailVerification();

        if (isVerified && userEmail) {
          setIsEmailVerified(true);
          setVerifiedEmail(userEmail);
          setIsEmailSent(true);

          const [localPart, domainPart] = userEmail.split('@');
          setEmail(localPart);

          const predefinedDomains = ['gmail.com', 'naver.com', 'daum.net'];
          if (predefinedDomains.includes(domainPart)) {
            setDomain(domainPart);
          } else {
            setDomain('custom');
            setCustomDomain(domainPart);
          }

          router.replace('/signup');
        }
      }
    };

    checkVerificationStatus();
  }, [searchParams, router]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isEmailVerified) return;

    setDomain(e.target.value);

    if (e.target.value !== 'custom') {
      setCustomDomain('');
      setDomainError('');
    }
  };

  const isValidEmail = () => {
    let fullEmail;

    if (!email || typeof email !== 'string') {
      setEmailError('이메일을 다시 입력해주세요');
      return false;
    }

    if (!domain || typeof domain !== 'string') {
      setDomainError('도메인을 선택해주세요');
      return false;
    }

    if (domain === 'custom') {
      if (!customDomain || typeof customDomain !== 'string') {
        setDomainError('도메인을 직접 입력해주세요');
        return false;
      }

      if (
        customDomain.startsWith('-') ||
        customDomain.endsWith('-') ||
        customDomain.includes('..') ||
        !customDomain.includes('.')
      ) {
        setDomainError('올바른 도메인 형식이 아닙니다');
        return false;
      }

      fullEmail = email + '@' + customDomain;
    } else {
      fullEmail = email + '@' + domain;
    }

    if (fullEmail.length > 254) {
      setEmailError('이메일이 너무 깁니다');
      return false;
    }
    if (email.indexOf('@') !== -1) {
      setEmailError('올바른 이메일 형식이 아닙니다');
      return false;
    }
    if (email.length < 1 || email.length > 64) {
      setEmailError('올바른 이메일 형식이 아닙니다');
      return false;
    }
    if (email.startsWith('.') || email.endsWith('.') || email.includes('..')) {
      setEmailError('올바른 이메일 형식이 아닙니다');
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(fullEmail)) {
      setEmailError('올바른 이메일 형식이 아닙니다');
      return false;
    }

    setEmailError('');
    setDomainError('');

    return true;
  };

  const isValidPassword = () => {
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요');
      return false;
    }
    if (password.length < 8 || password.length > 20) {
      setPasswordError('비밀번호 8자 이상 20자 이하로 입력해주세요');
      return false;
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

    const typeCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (typeCount < 2) {
      setPasswordError('비밀번호는 영문, 숫자, 특수문자 중 2종류 이상 포함해야 합니다');
      return false;
    }

    setPasswordError('');

    return true;
  };

  const isValidNickname = () => {
    if (!nickname) {
      setNicknameError('닉네임을 입력해주세요');
      return false;
    }
    if (nickname.length < 2 || nickname.length > 10) {
      setNicknameError('2자 이상 10자 이하로 적어주세요');
      return false;
    }
    const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;

    if (!nicknameRegex.test(nickname)) {
      setNicknameError('닉네임은 한글, 영문, 숫자만 사용 가능합니다');
      return false;
    }

    setNicknameError('');

    return true;
  };

  const checkEmailInputs = () => {
    if (email.length < 1) return false;
    if (domain.length < 1) return false;
    if (domain == 'custom' && customDomain.length < 1) return false;

    return true;
  };

  //이메일 인증하기 버튼 클릭 시
  const sendVerificationEmail = async () => {
    if (!isValidEmail()) return;

    setIsLoading(true);

    const fullEmail = domain === 'custom' ? `${email}@${customDomain}` : `${email}@${domain}`;
    const result = await sendEmailVerification(fullEmail);

    if (result.success) {
      alert(`${fullEmail}로 인증 이메일을 보냈습니다! 이메일을 확인해주세요.`);
      setIsEmailSent(true);
    } else {
      alert(`이메일 발송 실패: ${result.error}`);
    }

    setIsLoading(false);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError('');
    setDomainError('');
    setPasswordError('');
    setConfirmPwError('');
    setNicknameError('');

    if (!isValidEmail()) return;
    if (!isValidPassword()) return;

    if (!confirmPassword) {
      setConfirmPwError('비밀번호 확인을 입력해주세요');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPwError('비밀번호가 일치하지 않습니다');
      return;
    }
    if (!isValidNickname()) return;

    setIsLoading(true);

    try {
      const result = await completeSignUp({
        email: email, // 1단계에서 인증된 이메일
        password,
        nickname,
      });

      if (result.success) {
        alert('회원가입이 완료되었습니다!');
        router.push('/login');
      } else {
        alert(`회원가입 실패: ${result.error}`);
      }
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitForm} className="m-3 space-y-6">
      <div className="space-y-3">
        <label htmlFor="email-id" className="typo-body-bold block text-neutral-800">
          이메일
        </label>
        <div className="flex items-center gap-2">
          <Input
            id="email-id"
            type="text"
            placeholder="이메일"
            className="flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            status={emailError ? 'error' : 'default'}
          />
          <span className="typo-body-medium text-neutral-600">@</span>

          {domain === 'custom' ? (
            <input
              className={`typo-body-regular focus:ring-main focus:border-main flex-1 rounded-md border px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 ${domainError ? 'border-red-500' : 'border-neutral-400'}`}
              type="text"
              placeholder="도메인을 입력해주세요"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />
          ) : (
            <select
              className={`typo-body-regular focus:ring-main focus:border-main flex-1 rounded-md border px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 ${domainError ? 'border-red-500' : 'border-neutral-400'}`}
              value={domain}
              onChange={handleSelectChange}
            >
              <option value="">선택해주세요</option>
              <option value="gmail.com">gmail.com</option>
              <option value="naver.com">naver.com</option>
              <option value="daum.net">daum.net</option>
              <option value="custom">직접 입력</option>
            </select>
          )}
        </div>
        {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        {domainError && <p className="text-sm text-red-500">{domainError}</p>}

        <Button
          className="text-neutral-0 whitespace-nowrap bg-neutral-800 px-4 hover:bg-neutral-900"
          type="button"
          disabled={!checkEmailInputs() || isEmailVerified}
          onClick={sendVerificationEmail}
        >
          {isEmailVerified ? '인증 완료' : '이메일 인증하기'}
        </Button>
      </div>

      <div className="space-y-3">
        <label className="typo-body-bold block text-neutral-800">비밀번호</label>
        <p className="typo-caption-regular text-neutral-400">
          영문, 숫자, 특수문자 중 2종류 이상을 포함한 8자 이상의 비밀번호를 입력해 주세요.
        </p>
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          status={passwordError ? 'error' : 'default'}
          errorMessage={passwordError}
        />
      </div>

      <div className="space-y-3">
        <label className="typo-body-bold block text-neutral-800">비밀번호 확인</label>
        <Input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          status={confirmPasswordError ? 'error' : 'default'}
          errorMessage={confirmPasswordError}
        />
      </div>

      <div className="space-y-3">
        <label className="typo-body-bold block text-neutral-800">닉네임</label>
        <Input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          status={nicknameError ? 'error' : 'default'}
          errorMessage={nicknameError}
        />
      </div>

      <Button type="submit" className="bg-main hover:bg-main-text text-neutral-0 mt-8 w-full py-3">
        회원가입
      </Button>
    </form>
  );
};
