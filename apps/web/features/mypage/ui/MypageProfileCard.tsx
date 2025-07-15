import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import Link from 'next/link';

interface MyPageProfileCardProps {
  nickname: string;
  email: string;
  profile_img?: string | null;
}

const MyPageProfileCard = ({ nickname, email, profile_img }: MyPageProfileCardProps) => {
  console.log(profile_img);
  return (
    <div className="mx-[16px] flex items-center justify-between border-b border-neutral-100 pb-[25px] pt-[16px]">
      <div className="max-w-3/4 flex items-center">
        <Avatar className="size-[60px]" src={profile_img ?? undefined} />
        <ul className="pl-[18px]">
          <li>{nickname}</li>
          <li className="typo-caption-regular pt-[4px] text-neutral-600">{email}</li>
        </ul>
      </div>
      <Link
        href="/mypage/edit"
        className="typo-caption-regular border border-neutral-300 px-[10px] py-[5px] text-neutral-700"
      >
        프로필 수정
      </Link>
    </div>
  );
};

export default MyPageProfileCard;
