import StatusBadge from '@/shared/ui/badge/StatusBadge';
import { Heart, MapPin } from 'lucide-react';
import { Button } from '@repo/ui/components/Button/Button';
import MyPageMenuItem from '@/features/mypage/ui/MyPageMenuItem';
import { MyPageMenuListProps } from '@/features/mypage/types';
import { toast } from '@repo/ui/components/Toast/Sonner';

const MyPageMenuList = ({ address }: MyPageMenuListProps) => {
  const handleComingSoonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({ content: '준비 중인 기능입니다.' });
  };

  return (
    <div>
      <div className="p-box border-t-8 border-neutral-100 py-[15px]">
        <p className="typo-caption-regular py-[5px] text-neutral-600">내 쇼핑</p>
        <MyPageMenuItem
          label="내 별점"
          href="/mypage/reviews"
          onClick={handleComingSoonClick}
          // rightElement={
          //   <StatusBadge
          //     type="count-gray"
          //     label="99+"
          //     className="absolute right-11 top-[50%] translate-y-[-50%]"
          //   />
          // }
        />
        <MyPageMenuItem
          label="경매 제안"
          href="/mypage/proposal/received"
          withBorder={false}
          onClick={handleComingSoonClick}
        />
      </div>
      <div className="p-box border-t-8 border-neutral-100 py-[15px]">
        <p className="typo-caption-regular py-[5px] text-neutral-600">내 계정 정보</p>
        <MyPageMenuItem label="포인트" href="/mypage/point" onClick={handleComingSoonClick} />
        <MyPageMenuItem label="등급" href="/mypage/grade" onClick={handleComingSoonClick} />
        <MyPageMenuItem
          label="내 위치 수정"
          href="/setLocation"
          onClick={handleComingSoonClick}
          rightElement={
            <Button
              shape="rounded"
              size="fit"
              className="typo-caption-regular absolute right-11 top-[50%] h-[29px] translate-y-[-50%] gap-1 bg-neutral-900"
            >
              <MapPin className="size-5 stroke-1" />
              {address}
            </Button>
          }
        />

        <MyPageMenuItem label="회원 정보 수정" href="/mypage/edit" withBorder={false} />
      </div>

      <div className="p-box border-t-8 border-neutral-100 py-[15px]">
        <p className="typo-caption-regular py-[5px] text-neutral-600">고객지원</p>
        <MyPageMenuItem label="앱 설정" href="/settings" onClick={handleComingSoonClick} />
        <MyPageMenuItem label="공지사항" href="/notice" onClick={handleComingSoonClick} />
        <MyPageMenuItem label="고객센터" href="/support" onClick={handleComingSoonClick} />
        <MyPageMenuItem
          label="약관 및 정책"
          href="/terms"
          withBorder={false}
          onClick={handleComingSoonClick}
        />
      </div>
    </div>
  );
};

export default MyPageMenuList;
