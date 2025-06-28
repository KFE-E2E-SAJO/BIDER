import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import Link from 'next/link';

const MyPageProfileCard = () => {
  return (
    <div className="mx-[16px] flex items-center justify-between border-b border-neutral-100 pb-[25px] pt-[16px]">
      <div className="flex items-center">
        <Avatar
          className="size-[60px]"
          src="https://i.pinimg.com/originals/36/9a/fb/369afb7c81a3278b1fd8f804cd105b37.jpg"
        />
        <ul className="pl-[22px]">
          <li>입찰매니아</li>
          <li className="typo-caption-regular pt-[4px] text-neutral-600">kernel@fastcampus.com</li>
        </ul>
      </div>
      <Link
        href="/mypage/edit"
        className="typo-caption-regular border border-neutral-300 px-[20px] py-[6px] text-neutral-700"
      >
        프로필 수정
      </Link>
    </div>
  );
};

export default MyPageProfileCard;
