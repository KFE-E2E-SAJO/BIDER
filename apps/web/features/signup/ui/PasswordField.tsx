'use Client';
import { Input } from '@repo/ui/components/Input/Input';

interface Props {
  password: string;
  passwordError: string;
  onChangePassword: (value: string) => void;
}

export const PasswordField = ({ password, passwordError, onChangePassword }: Props) => {
  return (
    <div className="space-y-3">
      <label className="typo-body-bold block text-neutral-800">비밀번호</label>
      <p className="typo-caption-regular text-neutral-400">
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
