'use client';
import { Input } from '@repo/ui/components/Input/Input';

interface Props {
  confirmPassword: string;
  confirmPasswordError: string;
  onChangeConfirmPassword: (value: string) => void;
}

export const ConfirmPasswordField = ({
  confirmPassword,
  confirmPasswordError,
  onChangeConfirmPassword,
}: Props) => {
  return (
    <div className="space-y-3">
      <label className="typo-body-bold block text-neutral-800">비밀번호확인</label>
      <Input
        type="password"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => onChangeConfirmPassword(e.target.value)}
        status={confirmPasswordError ? 'error' : 'default'}
        errorMessage={confirmPasswordError}
      />
    </div>
  );
};
