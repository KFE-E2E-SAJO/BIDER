'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { sendEmailVerification, checkEmailVerification, completeSignUp } from '@/shared/lib/auth';
import { signupSchema } from '@/shared/lib/validation/signupSchema';
import { emailSchema } from '@/shared/lib/validation/signupSchema';

export const useSignUpForm = () => {
  const router = useRouter();

  // form 상태
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');

  // 인증 관련 상태
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // 오류 메시지 상태
  const [emailError, setEmailError] = useState('');
  const [domainError, setDomainError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPwError] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const isVerifiedFromCallback = searchParams.get('verified') === 'true';
    if (!isVerifiedFromCallback) return;

    const checkVerificationStatus = async () => {
      try {
        const { isVerified, email: userEmail } = await checkEmailVerification();
        if (isVerified && userEmail) {
          handleVerifiedEmail(userEmail);
          router.replace('/signup');
        } else {
          toast({ content: '이메일 인증이 완료되지 않았습니다. 다시 시도해주세요.' });
        }
      } catch {
        toast({ content: '인증 확인 중 오류가 발생했습니다. 다시 시도해주세요.' });
      }
    };

    checkVerificationStatus();

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'AUTH_SUCCESS') {
        handleVerifiedEmail(event.data.user.email);
        router.replace('/signup');
      } else if (event.data.type === 'AUTH_ERROR') {
        toast({ content: '인증 중 오류가 발생했습니다: ' + event.data.error });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  const handleVerifiedEmail = (userEmail: string) => {
    setIsEmailVerified(true);
    setVerifiedEmail(userEmail);
    setIsEmailSent(true);

    const [localPart, domainPart] = userEmail.split('@');
    if (!localPart || !domainPart) return;

    setEmail(localPart);

    const predefinedDomains = ['gmail.com', 'naver.com', 'daum.net'];
    if (predefinedDomains.includes(domainPart)) {
      setDomain(domainPart);
    } else {
      setDomain('custom');
      setCustomDomain(domainPart);
    }
  };

  const handleSelectChange = (value: string) => {
    if (isEmailVerified) return;
    setDomain(value);
    if (value !== 'custom') {
      setCustomDomain('');
      setDomainError('');
    }
  };

  const sendVerificationEmail = async () => {
    setEmailError('');
    setDomainError('');

    const isValid = emailSchema.safeParse({ email, domain, customDomain });
    if (!isValid.success) {
      isValid.error.issues.forEach((issue) => {
        if (issue.path[0] === 'email') setEmailError(issue.message);
        if (['domain', 'customDomain'].includes(issue.path[0] as string)) {
          setDomainError(issue.message);
        }
      });
      return;
    }

    const fullEmail = domain === 'custom' ? `${email}@${customDomain}` : `${email}@${domain}`;
    setIsLoading(true);

    try {
      const result = await sendEmailVerification(fullEmail);
      if (result?.success) {
        toast({ content: `${fullEmail}로 인증 이메일을 보냈습니다! 이메일을 확인해주세요.` });
        setIsEmailSent(true);
      } else {
        toast({ content: `${result?.error}` });
      }
    } catch {
      toast({ content: '이메일 발송 중 오류가 발생했습니다. 다시 시도해주세요.' });
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
      toast({ content: '이메일 인증을 완료해주세요.' });
      return;
    }

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
        toast({ content: '회원가입이 완료되었습니다!' });
        router.push('/login');
      } else {
        toast({ content: `회원가입 실패: ${result.error}` });
      }
    } catch {
      toast({ content: '회원가입 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    domain,
    customDomain,
    password,
    confirmPassword,
    nickname,

    isEmailSent,
    isEmailVerified,
    verifiedEmail,
    isLoading,
    emailError,
    domainError,
    passwordError,
    confirmPasswordError,
    nicknameError,

    setEmail,
    setDomain,
    setCustomDomain,
    setPassword,
    setConfirmPassword,
    setNickname,

    handleSelectChange,
    sendVerificationEmail,
    handleSubmitForm,
  };
};
