import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { MyPageProfileCardProps } from '@/features/mypage/types';

const MyPageProfileCard = ({ nickname, email, profile_img }: MyPageProfileCardProps) => {
  return (
    <div className="mx-[16px] flex flex-col border-b border-neutral-100 pb-[25px] pt-[16px]">
      <div className="flex items-center">
        <Avatar className="size-[60px]" src={profile_img ?? undefined} />
        <ul className="pl-[18px]">
          <li>{nickname}</li>
          <li className="typo-caption-regular pt-[4px] text-neutral-600">{email}</li>
        </ul>
      </div>
    </div>
  );
};

export default MyPageProfileCard;
