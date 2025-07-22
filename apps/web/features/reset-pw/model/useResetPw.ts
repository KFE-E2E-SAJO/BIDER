'use client';

import { supabase } from '@/shared/lib/supabaseClient';
import { passwordSchema } from '@/shared/lib/validation/signupSchema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useResetPw = () => {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setnewPasswordConfirm] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!supabase) {
      setStatus('Supabase 클라이언트가 초기화되지 않았습니다.');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setStatus('비밀번호가 일치하지 않습니다. 확인해주세요');
      return;
    }

    const result = passwordSchema.safeParse(newPassword);
    const result1 = passwordSchema.safeParse(newPasswordConfirm);

    if (!result.success || !result1.success) {
      setStatus('비밀번호 형식을 맞춰서 작성해주세요');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus('success');
    router.push('/login');
  };

  return {
    newPassword,
    newPasswordConfirm,
    status,
    setNewPassword,
    setnewPasswordConfirm,
    handleResetPassword,
  };
};
