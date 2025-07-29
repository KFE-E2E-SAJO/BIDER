import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { MyPageProfileCardProps } from '@/features/mypage/types';
import { Star } from 'lucide-react';
import Link from 'next/link';

const MyPageProfileCard = ({ nickname, email, profile_img }: MyPageProfileCardProps) => {
  return (
    <div className="mx-[16px] flex flex-col pt-[16px]">
      <div className="flex items-center">
        <Avatar className="size-[60px]" src={profile_img ?? undefined} />
        <ul className="pl-[18px]">
          <li>{nickname}</li>
          <li className="typo-caption-regular pt-[4px] text-neutral-600">{email}</li>
        </ul>
      </div>
      <div className="mt-[18px] flex justify-around border-b border-t border-neutral-100 py-[14px]">
        <div className="flex w-[50%] items-center justify-center gap-[23px] border-r border-neutral-100">
          <div className="typo-caption-regular text-neutral-600">포인트</div>
          <Link href="/mypage/point" className="typo-subtitle-small-medium flex items-center">
            {'2,580'}
          </Link>
        </div>
        <div className="flex w-[50%] items-center justify-center gap-[23px]">
          <div className="typo-caption-regular text-neutral-600">별점</div>
          <div className="typo-subtitle-small-medium flex items-center">
            <Star className="fill-main text-main mr-[4px]" size={18} />
            {'4.3'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageProfileCard;
