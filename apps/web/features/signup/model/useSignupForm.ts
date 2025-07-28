'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { completeSignUp } from '@/shared/lib/auth';
import { signupSchema } from '@/shared/lib/validation/signupSchema';
import { emailSchema } from '@/shared/lib/validation/signupSchema';
import { supabase } from '@/shared/lib/supabaseClient';

export const useSignUpForm = () => {
  const router = useRouter();

  // form 상태
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [verifiedCode, setVerifiedCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');

  // 인증 관련 상태
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setIsdisabled] = useState(true);

  // 오류 메시지 상태
  const [emailError, setEmailError] = useState('');
  const [domainError, setDomainError] = useState('');
  const [verifiedCodeError, setVerifiedCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPwError] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  useEffect(() => {
    // 이메일 인증이 완료되면 disabled 상태 업데이트
    setIsdisabled(!isEmailVerified);
  }, [isEmailVerified]);

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
      const { data, error } = await supabase.auth.signInWithOtp({
        email: fullEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.error('OTP 발송 에러:', error);
        toast({ content: `인증 코드 전송 실패: ${error.message}` });
        return;
      }

      toast({ content: `${fullEmail}로 인증 코드가 전송되었습니다.` });
      setIsEmailSent(true);
      setVerifiedEmail(fullEmail);
    } catch (error) {
      console.error('이메일 발송 오류:', error);
      toast({ content: '인증 코드 발송 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verifiedCode || !verifiedEmail) {
      setVerifiedCodeError('인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setVerifiedCodeError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: verifiedEmail,
        token: verifiedCode,
        type: 'email',
      });

      if (error) {
        console.error('OTP 인증 에러:', error);
        setVerifiedCodeError('인증 코드가 올바르지 않습니다.');
        return;
      }

      if (data.user) {
        setIsEmailVerified(true);
        toast({ content: '이메일 인증이 완료되었습니다!' });

        // 인증 완료 후 세션 종료 (회원가입 완료 전까지)
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('인증 코드 확인 오류:', error);
      setVerifiedCodeError('인증 코드 확인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError('');
    setDomainError('');
    setVerifiedCodeError('');
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
      const signUpResult = await completeSignUp({
        email: verifiedEmail,
        password,
        nickname,
      });

      if (signUpResult.success) {
        toast({ content: '회원가입이 완료되었습니다!' });
        router.push('/login');
      } else {
        toast({ content: `회원가입 실패: ${signUpResult.error}` });
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      toast({ content: '회원가입 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    domain,
    customDomain,
    verifiedCode,
    password,
    confirmPassword,
    nickname,

    isEmailSent,
    isEmailVerified,
    verifiedEmail,
    isLoading,
    disabled,

    emailError,
    domainError,
    verifiedCodeError,
    passwordError,
    confirmPasswordError,
    nicknameError,

    setEmail,
    setDomain,
    setCustomDomain,
    setVerifiedCode,
    setPassword,
    setConfirmPassword,
    setNickname,

    handleSelectChange,
    sendVerificationEmail,
    verifyCode, // 새로 추가된 함수
    handleSubmitForm,
  };
};
