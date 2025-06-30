'use client';

import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { Button } from '@repo/ui/components/Button/Button';
import { Input } from '@repo/ui/components/Input/Input';

const ProfileInputList = () => {
  return (
    <form className="flex flex-col items-center gap-5">
      <Avatar
        className="size-[95px]"
        src="https://i.pinimg.com/originals/36/9a/fb/369afb7c81a3278b1fd8f804cd105b37.jpg"
      />
      <div className="w-full space-y-2">
        <label className="typo-body-medium block text-neutral-800">닉네임</label>
        <Input type="text" placeholder="닉네임" className="" />
      </div>

      <Button>저장하기</Button>
    </form>
  );
};

export default ProfileInputList;
