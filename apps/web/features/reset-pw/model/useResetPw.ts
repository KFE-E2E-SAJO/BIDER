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

    const result = passwordSchema.safeParse(newPassword);
    const result1 = passwordSchema.safeParse(newPasswordConfirm);

    if (newPassword !== newPasswordConfirm) {
      setStatus('비밀번호가 일치하지 않습니다. 확인해주세요');
      return;
    }

    if (!result.success || !result1.success) {
      setStatus('비밀번호 형식을 맞춰서 작성해주세요');
      return false;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setStatus(error.message);
      return;
    } else {
      setStatus('success');
      router.push('/login');
    }
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
