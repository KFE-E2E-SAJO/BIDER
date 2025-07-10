'use client';
import { Input } from '@repo/ui/components/Input/Input';

interface Props {
  nickname: string;
  nicknameError: string;
  onChangeNickname: (value: string) => void;
}

export const NicknameField = ({ nickname, nicknameError, onChangeNickname }: Props) => {
  return (
    <div className="space-y-3">
      <label className="typo-body-bold block text-neutral-800">닉네임</label>
      <Input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => onChangeNickname(e.target.value)}
        status={nicknameError ? 'error' : 'default'}
        errorMessage={nicknameError}
      />
    </div>
  );
};
