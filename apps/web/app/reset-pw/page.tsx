'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/shared/lib/supabaseClient';
import { Input } from '@repo/ui/components/Input/Input';
import { KeyIcon, Lock } from 'lucide-react';
import { Button } from '@repo/ui/components/Button/Button';
import { passwordSchema } from '@/shared/lib/validation/password';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setnewPasswordConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = passwordSchema.safeParse(newPassword);
    const result1 = passwordSchema.safeParse(newPasswordConfirm);

    if (newPassword !== newPasswordConfirm) {
      alert('비밀번호가 일치하지 않습니다. 확인해주세요');
      return;
    }

    if (!result.success || !result1.success) {
      alert('비밀번호 형식을 맞춰서 작성해주세요');
      return false;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      router.push('/login');
    }
  };

  return (
    <div className="m-3">
      <p className='className="typo-body-medium mt-[11.5rem] flex justify-center text-[1.25rem]'>
        비밀번호 재설정
      </p>
      <form onSubmit={handleResetPassword}>
        <Input
          label="새로운 비밀번호"
          className="mt-[1.81rem]"
          type="password"
          placeholder="새로운 비밀번호"
          icon={<Lock />}
          inputStyle="pl-12 pr-11"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <Input
          label="새 비밀번호 확인"
          className="mt-[1.81rem]"
          type="password"
          placeholder="새 비밀번호 확인"
          icon={<Lock />}
          inputStyle="pl-12 pr-11"
          value={newPasswordConfirm}
          onChange={(e) => setnewPasswordConfirm(e.target.value)}
          required
        />

        <Button type="submit" className="mt-[0.81rem]">
          재설정하기
        </Button>
      </form>
    </div>
  );
}
