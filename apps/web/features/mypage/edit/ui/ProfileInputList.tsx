'use client';

import { Button } from '@repo/ui/components/Button/Button';
import { Input } from '@repo/ui/components/Input/Input';
import ProfilePreview, { UploadedImage } from '@/features/mypage/edit/ui/ProfilePreview';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';
import { useGetEditProfile } from '@/features/mypage/edit/model/useGetEditProfile';
import { useRouter } from 'next/navigation';
import { toast } from '@repo/ui/components/Toast/Sonner';

const ProfileInputList = () => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const { data, isLoading, error } = useGetEditProfile({ userId });
  const profile = data?.profile;

  const [newNickname, setNewNickname] = useState('');
  const [profileImgSrc, setProfileImgSrc] = useState<string | null>(null);

  const [avatar, setAvatar] = useState<UploadedImage | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (profile?.nickname) setNewNickname(profile.nickname);
    if (profile?.profile_img) {
      setProfileImgSrc(profile.profile_img);
      setIsDeleted(false);
    }
  }, [profile?.nickname, profile?.profile_img]);

  if (!userId || error || isLoading || !data) return <Loading />;

  const isModified = newNickname !== profile.nickname || avatar !== null || isDeleted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nicknameChanged = newNickname !== profile.nickname;

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('nickname', nicknameChanged ? newNickname : profile.nickname);

    if (isDeleted) {
      formData.append('isDeleted', 'true');
    } else if (avatar?.file) {
      formData.append('profileImg', avatar.file);
    }

    try {
      const res = await fetch('/api/mypage', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      router.push('/mypage');
      router.refresh();
      toast({ content: '수정되었습니다.' });
    } catch (error) {
      toast({ content: (error as Error).message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
      <ProfilePreview
        profileImg={profileImgSrc}
        onChangeAvatar={(avatar) => {
          setAvatar(avatar);
          setProfileImgSrc(null);
          setIsDeleted(false);
        }}
        onDelete={() => {
          setAvatar(null);
          setProfileImgSrc(null);
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
