'use client';
import { supabase } from '@/shared/lib/supabaseClient';
import { validateFullEmail } from '@/shared/lib/validation/email';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useFindId = () => {
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
        toast({ content: '등록되지 않은 사용자명입니다.' });
        return;
      }

      const maskedEmail = maskEmail(data.email);
      setResult(maskedEmail);
      setIsFound(true);
    } catch (err) {
      console.error('이메일 검색 오류:', err);
      toast({ content: '검색 중 오류가 발생했습니다.' });
    }
  };

  // 비밀번호 찾기(이메일 입력)
  const handlePasswordReset = async () => {
    const [email, domain] = inputValue.split('@');
    if (!email || !domain) {
      toast({ content: '유효하지 않은 이메일 형식입니다.' });
      return;
    }

    const result = validateFullEmail({ email, domain });

    if (result.success) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(inputValue.trim(), {
          redirectTo: `http://localhost:3000/reset-pw`,
        });

        if (error) {
          toast({ content: '등록되지 않은 이메일이거나 오류가 발생했습니다.' });
          return;
        }

        setResult('비밀번호 재설정 이메일이 발송되었습니다.');
        setIsFound(true);
      } catch (err) {
        console.error('비밀번호 재설정 오류:', err);
        toast({ content: '재설정 중 오류가 발생했습니다.' });
      }
    } else {
      toast({ content: '올바른 이메일 형식을 입력해주세요' });
      return;
    }
  };

  // 버튼 클릭 시
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      toast({ content: `${accountType === 'email' ? '사용자명을' : '이메일을'} 입력해주세요.` });
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

  return {
    inputValue,
    isFound,
    isSearching,
    accountType,
    result,
    setInputValue,
    handleSubmit,
  };
};
