'use client';
import { Input } from '@repo/ui/components/Input/Input';
import { Button } from '@repo/ui/components/Button/Button';
import { useState } from 'react';
import '@repo/ui/styles.css';

export const SignUpForm = () => {
  const [email, setEmail] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [customDomain, setCustomDomain] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');

  // 이메일 인증 관련 변수
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false); // 이메일 보냈는지 여부
  const [verificationCode, setVerificationCode] = useState<string>(''); // 사용자가 입력한 인증번호
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false); // 인증 완료됐는지 여부

  // 오류 관련 변수
  const [emailError, setEmailError] = useState<string>('');
  const [domainError, setDomainError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPwError] = useState<string>('');
  const [nicknameError, setNicknameError] = useState<string>('');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDomain(e.target.value);
    console.log(setDomain);
    if (e.target.value !== 'custom') {
      setDomain(e.target.value);
      // setCustomDomain('');
      // setDomainError('');
    }
  };

  //이메일 유효성 체크
  const isValidEmail = () => {
    let fullEmail;

    if (!email) {
      setEmailError('이메일을 입력해주세요');
      return false;
    }

    if (!domain) {
      setDomainError('도메인을 선택해주세요');
      return false;
    }

    if (domain === 'custom') {
      if (!customDomain) {
        setDomainError('도메인을 직접 입력해주세요');
        return false;
      }
      if (customDomain.length < 1 || customDomain.length > 255) {
        setDomainError('올바른 도메인 형식이 아닙니다');
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fullEmail)) {
      setEmailError('올바른 이메일 형식이 아닙니다');
      return false;
    }

    return true;
  };

  //비밀번호 유효성 체크
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

    return true;
  };

  //닉네임 유효성 체크
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

    return true;
  };

  // 이메일 인증하기 버튼 활성화
  const checkEmailInputs = () => {
    if (email.length < 1) return false;
    if (domain.length < 1) return false;
    if (domain == 'custom' && customDomain.length < 1) return false;

    return true;
  };

  // 이메일 인증번호 보내기
  const sendVerificationEmail = () => {
    const fullEmail = domain === 'custom' ? `${email}@${customDomain}` : `${email}@${domain}`;

    alert(`${fullEmail}로 인증번호를 보냈습니다! (아직 진짜로는 안 보내짐)`);

    // 3. 이메일 보냈다고 표시
    setIsEmailSent(true);
  };

  // 회원가입 완료버튼
  const handleSubmitForm = (e: React.FormEvent) => {
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

    // API 호출은 나중에 추가
    alert('회원가입이 완료되었습니다');
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
