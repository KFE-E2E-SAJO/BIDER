import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import Link from 'next/link';

interface MyPageProfileCardProps {
  nickname: string;
  email: string;
  profileImg?: string | null;
}

const MyPageProfileCard = ({ nickname, email, profileImg }: MyPageProfileCardProps) => {
  return (
    <div className="mx-[16px] flex items-center justify-between border-b border-neutral-100 pb-[25px] pt-[16px]">
      <div className="flex items-center">
        <Avatar className="size-[60px]" src={profileImg ?? undefined} />
        <ul className="pl-[18px]">
          <li>{nickname}</li>
          <li className="typo-caption-regular pt-[4px] text-neutral-600">{email}</li>
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
