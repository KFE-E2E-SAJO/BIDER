'use client';

import { Button } from '@repo/ui/components/Button/Button';
import { Input } from '@repo/ui/components/Input/Input';
import ProfilePreview, { UploadedImage } from './ProfilePreview';
import { useState } from 'react';
import { setUserInfo } from '@/features/mypage/edit/model/setUserInfo';
import { redirect } from 'next/navigation';

interface ProfileInputListProps {
  userId: string;
  nickname: string;
  profileImg?: string | null;
}

const ProfileInputList = ({ userId, nickname, profileImg }: ProfileInputListProps) => {
  const [newNickname, setNewNickname] = useState(nickname);
  const [avatar, setAvatar] = useState<UploadedImage | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const isModified = newNickname !== nickname || avatar !== null || isDeleted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nicknameChanged = newNickname !== nickname;

    const updatedUserData = {
      userId,
      nickname: nicknameChanged ? newNickname : nickname,
      profileImg: (isDeleted ? null : (avatar?.preview ?? profileImg)) as string | null,
    };
    console.log('userId:', userId);

    try {
      await setUserInfo(updatedUserData);
      redirect('/mypage');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
      <ProfilePreview
        profileImg={profileImg}
        onChangeAvatar={setAvatar}
        onDelete={() => {
          setAvatar(null);
          setIsDeleted(true);
        }}
      />

      <div className="w-full space-y-2">
        <label className="typo-body-medium block text-neutral-800">닉네임</label>
        <Input type="text" value={newNickname} onChange={(e) => setNewNickname(e.target.value)} />
      </div>

      <Button type="submit" disabled={!isModified}>
        저장하기
      </Button>
    </form>
  );
};

export default ProfileInputList;
