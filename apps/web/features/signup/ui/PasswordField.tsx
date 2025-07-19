'use Client';
import { Input } from '@repo/ui/components/Input/Input';

interface Props {
  password: string;
  passwordError: string;
  onChangePassword: (value: string) => void;
}

export const PasswordField = ({ password, passwordError, onChangePassword }: Props) => {
  return (
    <div className="flex flex-col">
      <label className="typo-body-bold mb-[8px] block text-neutral-900">비밀번호</label>
      <p className="typo-caption-regular mb-[13px] text-neutral-600">
        영문, 숫자, 특수문자 중 2종류 이상을 포함한 8자 이상의 비밀번호를 입력해 주세요.
      </p>
      <Input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => onChangePassword(e.target.value)}
        status={passwordError ? 'error' : 'default'}
        errorMessage={passwordError}
      />
    </div>
  );
};
