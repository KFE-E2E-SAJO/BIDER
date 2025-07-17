'use client';

import { Input } from '@repo/ui/components/Input/Input';
import { Lock } from 'lucide-react';
import { Button } from '@repo/ui/components/Button/Button';
import { useResetPw } from '@/features/reset-pw/model/useResetPw';

export default function ResetPasswordPage() {
  const {
    newPassword,
    newPasswordConfirm,
    status,
    setNewPassword,
    setnewPasswordConfirm,
    handleResetPassword,
  } = useResetPw();

  return (
    <div className="m-3">
      <p className="typo-body-medium mt-[11.5rem] flex justify-center text-[1.25rem]">
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

        {status && <p className="typo-caption-regular text-danger">{status}</p>}
        <Button type="submit" className="mt-[0.81rem]">
          재설정하기
        </Button>
      </form>
    </div>
  );
}
