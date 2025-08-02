import { Button } from '@repo/ui/components/Button/Button';
import { Check } from 'lucide-react';

interface EmailVerifiedFieldProps {
  verifiedCode: string;
  verifiedCodeError: string;
  isEmailVerified: boolean;
  verifiedEmail: string;
  onChangeVerifiedCode: (value: string) => void;
  onClickVerifyCode: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const EmailVerifiedField = ({
  verifiedCode,
  verifiedCodeError,
  isEmailVerified,
  verifiedEmail,
  onChangeVerifiedCode,
  onClickVerifyCode,
  disabled,
  isLoading,
}: EmailVerifiedFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="typo-body-bold mb-[8px] block text-neutral-900">인증 코드</label>
      <p className="typo-body-regular mb-2 text-neutral-600">
        {verifiedEmail}로 전송된 인증 코드를 입력해주세요.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={verifiedCode}
          onChange={(e) => onChangeVerifiedCode(e.target.value)}
          placeholder="인증 코드 6자리를 입력하세요"
          maxLength={6}
          className={`focus:ring-main flex rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${
            isEmailVerified
              ? 'cursor-not-allowed border-neutral-400 bg-neutral-300'
              : 'border-gray-300'
          }`}
          disabled={isEmailVerified || isLoading}
        />
        <Button
          type="button"
          onClick={onClickVerifyCode}
          disabled={isLoading || !verifiedCode || verifiedCode.length !== 6 || isEmailVerified}
          className={`flex-1 rounded-md px-4 py-2 text-white disabled:cursor-not-allowed ${
            isEmailVerified ? 'text-neutral-0' : 'hover:bg-blue-700 disabled:bg-gray-300'
          }`}
        >
          {isLoading ? (
            '확인 중...'
          ) : isEmailVerified ? (
            <span className="inline-flex items-center gap-1">
              <Check size={15} />
              인증 완료
            </span>
          ) : (
            '인증 확인'
          )}
        </Button>
      </div>
      {verifiedCodeError && <p className="text-sm text-red-600">{verifiedCodeError}</p>}
    </div>
  );
};
