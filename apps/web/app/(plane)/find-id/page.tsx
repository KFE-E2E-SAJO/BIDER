'use client';
import { Input } from '@repo/ui/components/Input/Input';
import { User, Mail } from 'lucide-react';
import '@repo/ui/styles.css';
import { Button } from '@repo/ui/components/Button/Button';
import { useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import { validateFullEmail } from '@/shared/lib/validation/email';

export default function FindAccountPage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isFound, setIsFound] = useState<boolean>(false);
  const [accountType, setAccountType] = useState<'email' | 'password'>('email');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get('type');

    if (type === 'email' || type === 'password') {
      setAccountType(type);

      setInputValue('');
      setResult('');
      setIsFound(false);
    } else {
      router.replace('/find-id?type=email');
    }
  }, [searchParams, router]);

  // 이메일 마스킹 함수
  const maskEmail = (email: string): string => {
    const [localPart, domain] = email.split('@');

    if (!localPart || !domain) {
      throw new Error('Invalid email format');
    }
    if (localPart.length <= 3) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart.slice(0, 3)}***@${domain}`;
  };

  // 이메일 찾기(닉네임 입력)
  const handleNicnameSearch = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('nickname', inputValue.trim())
        .single();

      if (error || !data?.email) {
        alert('등록되지 않은 사용자명입니다.');
        return;
      }

      const maskedEmail = maskEmail(data.email);
      setResult(maskedEmail);
      setIsFound(true);
    } catch (err) {
      console.error('이메일 검색 오류:', err);
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  // 비밀번호 찾기(이메일 입력)
  const handlePasswordReset = async () => {
    const [email, domain] = inputValue.split('@');
    if (!email || !domain) {
      alert('유효하지 않은 이메일 형식입니다.');
      return;
    }

    const result = validateFullEmail({ email, domain });

    if (result.success) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(inputValue.trim(), {
          redirectTo: `http://localhost:3000/reset-pw`,
        });

        if (error) {
          alert('등록되지 않은 이메일이거나 오류가 발생했습니다.');
          return;
        }

        setResult('비밀번호 재설정 이메일이 발송되었습니다.');
        setIsFound(true);
      } catch (err) {
        console.error('비밀번호 재설정 오류:', err);
        alert('재설정 중 오류가 발생했습니다.');
      }
    } else {
      alert('올바른 이메일 형식을 입력해주세요');
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      alert(`${accountType === 'email' ? '사용자명을' : '이메일을'} 입력해주세요.`);
      return;
    }

    setIsSearching(true);
    setResult('');
    setIsFound(false);

    try {
      if (accountType === 'email') {
        await handleNicnameSearch();
      } else {
        await handlePasswordReset();
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setInputValue('');
    setResult('');
    setIsFound(false);
  };

  // 타입별 설정 객체
  const getConfig = () => {
    if (accountType === 'email') {
      return {
        title: '아이디(이메일) 찾기',
        placeholder: '닉네임',
        icon: <User />,
        inputType: 'text' as const,
        buttonText: '아이디(이메일) 찾기',
        resultPrefix: '이메일: ',
        description: '보안을 위해 이메일의 일부가 마스킹되었습니다.',
      };
    } else {
      return {
        title: '비밀번호 찾기',
        placeholder: '이메일 주소',
        icon: <Mail />,
        inputType: 'email' as const,
        buttonText: '재설정 이메일 발송',
        resultPrefix: '',
        description: '입력하신 이메일로 재설정 링크를 확인해주세요.',
      };
    }
  };

  const config = getConfig();

  return (
    <div className="m-3">
      <p className="typo-body-medium mt-[11.5rem] flex justify-center text-[1.25rem]">
        {config.title}
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <Input
            className="mt-[1.81rem]"
            type={config.inputType}
            icon={config.icon}
            placeholder={config.placeholder}
            inputStyle="pl-12 pr-11"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isFound}
            required
          />
        </div>

        <Button type="submit" className="mt-[0.81rem]" disabled={isSearching || isFound}>
          {isSearching ? '처리 중...' : config.buttonText}
        </Button>
      </form>

      {isFound && result && (
        <div className="mt-[2rem] rounded-lg p-4 text-left">
          <div className="mb-3 rounded-sm border border-neutral-300">
            <p className="mb-1 mt-[1.12rem] pl-4 text-sm text-gray-600">
              {accountType === 'email' ? '사용자 이름과 일치하는 이메일입니다:' : '발송 완료:'}
            </p>
            <p className="typo-caption-medium mb-2 pl-4 text-sm">
              {config.resultPrefix}
              {result}
            </p>
            <p className="mb-[1.12rem] mt-2 pl-4 text-xs text-gray-500">{config.description}</p>
          </div>

          <div className="flex-cols flex gap-[0.56rem]">
            <Button variant="secondary" className="flex-1" onClick={() => router.push('/login')}>
              로그인 하기
            </Button>

            {accountType == 'email' && (
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => router.push('/find-id?type=password')}
              >
                비밀번호 찾기
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
