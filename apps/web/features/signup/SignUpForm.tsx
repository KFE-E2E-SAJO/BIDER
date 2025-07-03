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
import { signupSchema } from '../../shared/lib/validation/signupSchema';
import { emailSchema } from '@/shared/lib/validation/email';
import { z } from 'zod';
import { Base } from '@repo/ui/components/Checkbox/Base';

export const SignUpForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [customDomain, setCustomDomain] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');

  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<string>('');
  const [domainError, setDomainError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPwError] = useState<string>('');
  const [nicknameError, setNicknameError] = useState<string>('');

  useEffect(() => {
    // 기존 이메일 인증 여부 확인 코드
    const checkVerificationStatus = async () => {
      const isVerifiedFromCallback = searchParams.get('verified') === 'true';

      if (isVerifiedFromCallback) {
        try {
          const { isVerified, email: userEmail } = await checkEmailVerification();

          if (isVerified && userEmail) {
            setIsEmailVerified(true);
            setVerifiedEmail(userEmail);
            setIsEmailSent(true);

            if (typeof userEmail === 'string' && userEmail.includes('@')) {
              const emailParts = userEmail.split('@');

              if (emailParts.length === 2) {
                const [localPart, domainPart] = emailParts;

                if (localPart && domainPart) {
                  setEmail(localPart);

                  const predefinedDomains = ['gmail.com', 'naver.com', 'daum.net'];
                  if (predefinedDomains.includes(domainPart)) {
                    setDomain(domainPart);
                  } else {
                    setDomain('custom');
                    setCustomDomain(domainPart);
                  }
                } else {
                  console.error('이메일 형식이 올바르지 않습니다:', userEmail);
                  return;
                }
              } else {
                console.error('이메일 형식이 올바르지 않습니다:', userEmail);
                return;
              }
            } else {
              console.error('유효하지 않은 이메일:', userEmail);
              return;
            }

            router.replace('/signup');

            setTimeout(() => {
              alert('이메일 인증이 완료되었습니다! 이제 회원가입을 계속 진행해주세요.');
            }, 100);
          } else {
            console.log('이메일 인증 실패:', { isVerified, userEmail });
            alert('이메일 인증이 완료되지 않았습니다. 다시 시도해주세요.');
          }
        } catch (error) {
          console.error('인증 확인 중 오류:', error);
          alert('인증 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } else {
        return;
      }
    };

    // 새창에서 오는 메시지 리스너 추가
    const handleMessage = (event: MessageEvent) => {
      // 보안을 위해 origin 체크
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'AUTH_SUCCESS') {
        // 인증 성공 처리
        setIsEmailVerified(true);
        setVerifiedEmail(event.data.user.email);
        setIsEmailSent(true);

        // 이메일 필드 채우기
        if (event.data.user.email) {
          const emailParts = event.data.user.email.split('@');
          if (emailParts.length === 2) {
            const [localPart, domainPart] = emailParts;
            setEmail(localPart);

            const predefinedDomains = ['gmail.com', 'naver.com', 'daum.net'];
            if (predefinedDomains.includes(domainPart)) {
              setDomain(domainPart);
            } else {
              setDomain('custom');
              setCustomDomain(domainPart);
            }
          }
        }

        // URL에서 verified 파라미터 제거
        router.replace('/signup');
      } else if (event.data.type === 'AUTH_ERROR') {
        alert('인증 중 오류가 발생했습니다: ' + event.data.error);
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('message', handleMessage);

    // 기존 인증 확인 실행
    checkVerificationStatus();

    // 클린업 함수에서 이벤트 리스너 제거
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [searchParams, router]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isEmailVerified) return;

    setDomain(e.target.value);

    if (e.target.value !== 'custom') {
      setCustomDomain('');
      setDomainError('');
    }
  };

  const checkEmailInputs = () => {
    if (email.length < 1) return false;
    if (domain.length < 1) return false;
    if (domain === 'custom' && customDomain.length < 1) return false;

    return true;
  };

  //이메일 인증하기 버튼 클릭 시
  const sendVerificationEmail = async () => {
    setEmailError('');
    setDomainError('');

    const isValid = emailSchema.safeParse({ email, domain, customDomain });
    if (!isValid.success) {
      isValid.error.issues.forEach((issue) => {
        if (issue.path[0] === 'email') setEmailError(issue.message);
        if (issue.path[0] === 'domain' || issue.path[0] === 'customDomain')
          setDomainError(issue.message);
      });
      return;
    }

    const fullEmail = domain === 'custom' ? `${email}@${customDomain}` : `${email}@${domain}`;

    setIsLoading(true);

    try {
      const result = await sendEmailVerification(fullEmail);

      if (result?.success) {
        alert(`${fullEmail}로 인증 이메일을 보냈습니다! 이메일을 확인해주세요.`);
        setIsEmailSent(true);
      } else {
        alert(`${result?.error}`);
      }
    } catch (error) {
      alert('이메일 발송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError('');
    setDomainError('');
    setPasswordError('');
    setConfirmPwError('');
    setNicknameError('');

    if (!isEmailVerified || !verifiedEmail) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }
    const fullEmail = domain === 'custom' ? `${email}@${customDomain}` : `${email}@${domain}`;

    const result = signupSchema.safeParse({
      email,
      domain,
      customDomain,
      password,
      confirmPassword,
      nickname,
    });

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        switch (issue.path[0]) {
          case 'email':
            setEmailError(issue.message);
            break;
          case 'domain':
          case 'customDomain':
            setDomainError(issue.message);
            break;
          case 'password':
            setPasswordError(issue.message);
            break;
          case 'confirmPassword':
            setConfirmPwError(issue.message);
            break;
          case 'nickname':
            setNicknameError(issue.message);
            break;
        }
      });
      return;
    }
    setIsLoading(true);

    try {
      const result = await completeSignUp({
        email: verifiedEmail,
        password,
        nickname,
      });

      if (result.success) {
        alert('회원가입이 완료되었습니다!');
        router.push('/setLocation');
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
    <form onSubmit={handleSubmitForm} className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="email-id" className="typo-body-bold block text-neutral-800">
          이메일 {isEmailVerified && <span className="text-sm text-green-600">✓ 인증완료</span>}
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
            disabled={isEmailVerified}
          />
          <span className="typo-body-medium text-neutral-600">@</span>

          {domain === 'custom' ? (
            <input
              className={`typo-body-regular focus:ring-main focus:border-main flex-1 rounded-md border px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 ${
                domainError ? 'border-red-500' : 'border-neutral-400'
              } ${isEmailVerified ? 'cursor-not-allowed bg-gray-100' : ''}`}
              type="text"
              placeholder="도메인을 입력해주세요"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              disabled={isEmailVerified}
            />
          ) : (
            <select
              className={`typo-body-regular focus:ring-main focus:border-main flex-1 rounded-md border px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 ${
                domainError ? 'border-red-500' : 'border-neutral-400'
              } ${isEmailVerified ? 'cursor-not-allowed bg-gray-100' : ''}`}
              value={domain}
              onChange={handleSelectChange}
              disabled={isEmailVerified}
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
          className={`whitespace-nowrap px-4 ${
            isEmailVerified
              ? 'cursor-not-allowed bg-green-600 text-white'
              : 'text-neutral-0 bg-neutral-800 hover:bg-neutral-900'
          }`}
          type="button"
          disabled={!checkEmailInputs() || isEmailVerified || isLoading}
          onClick={sendVerificationEmail}
        >
          {isLoading ? '발송 중...' : isEmailVerified ? '✓ 인증 완료' : '이메일 인증하기'}
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

      <div className="solid space-y-3">
        <label className="typo-body-bold block text-neutral-800">약관동의</label>

        <div className="flex flex-col border border-neutral-400 pb-5 pl-6 pt-5">
          <Base>전체 동의</Base>
          <hr className="mb-5 mr-5 mt-5 border-neutral-400"></hr>

          <div className="flex flex-col gap-5">
            <Base>이용약관 동의 (필수)</Base>
            <Base>개인정보 수집 및 이용 동의 (필수)</Base>
            <Base>마케팅 정보 수신 동의 (선택)</Base>
            <Base>이벤트 및 혜택 알림 동의 (선택)</Base>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="bg-main hover:bg-main-dark text-neutral-0 mt-8 w-full py-3 disabled:cursor-not-allowed disabled:bg-neutral-400"
        disabled={isLoading || !isEmailVerified}
      >
        {isLoading ? '처리 중...' : '회원가입'}
      </Button>
    </form>
  );
};
