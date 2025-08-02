import { Button } from '@repo/ui/components/Button/Button';
import { Check } from 'lucide-react';
import { useSignUpForm } from '../model/useSignupForm';

interface EmailVerifiedFieldProps {
  verifiedCode: string;
  verifiedCodeError: string;
  onChangeVerifiedCode: (value: string) => void;
  onClickVerifyCode: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const EmailVerifiedField = ({
  verifiedCode,
  verifiedCodeError,
  onChangeVerifiedCode,
  onClickVerifyCode,
  disabled,
  isLoading,
}: EmailVerifiedFieldProps) => {
  const isEmailVerified = useSignUpForm();
  return (
    <div className="space-y-2">
      <label className="typo-body-bold mb-[8px] block text-neutral-900">인증 코드</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={verifiedCode}
          onChange={(e) => onChangeVerifiedCode(e.target.value)}
          placeholder="인증 코드 6자리를 입력하세요"
          maxLength={6}
          className="flex rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled || isLoading}
        />
        <Button
          type="button"
          onClick={onClickVerifyCode}
          disabled={isLoading || !verifiedCode || verifiedCode.length !== 6 || disabled}
          className="flex-1 rounded-md px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isLoading ? '확인 중...' : '인증 확인'}
        </Button>
      </div>
      {verifiedCodeError && <p className="text-sm text-red-600">{verifiedCodeError}</p>}
    </div>
  );
};
