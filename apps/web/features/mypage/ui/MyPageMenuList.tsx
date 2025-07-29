import { MapPin } from 'lucide-react';
import { Button } from '@repo/ui/components/Button/Button';
import MyPageMenuItem from '@/features/mypage/ui/MyPageMenuItem';
import { MyPageMenuListProps } from '@/features/mypage/types';
import { toast } from '@repo/ui/components/Toast/Sonner';

const MyPageMenuList = ({ address, point }: MyPageMenuListProps) => {
  const handleComingSoonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({ content: '준비 중인 기능입니다.' });
  };

  return (
    <div>
      <div className="p-box border-t-8 border-neutral-100 py-[15px]">
        <p className="typo-caption-regular py-[5px] text-neutral-600">내 쇼핑</p>
        <MyPageMenuItem label="경매 제안" href="/mypage/proposal/received" />
        <MyPageMenuItem
          label="포인트"
          href="/"
          rightElement={
            <Button
              shape="rounded"
              size="fit"
              className="typo-caption-medium bg-main-lightest text-main absolute right-11 top-[50%] h-[29px] translate-y-[-50%] px-[11px]"
            >
              {point.toLocaleString()}P
            </Button>
          }
        />
        {/* /mypage/point */}
        <MyPageMenuItem label="등급" href="/" onClick={handleComingSoonClick} />
        {/* mypage/grade */}
        <MyPageMenuItem
          label="내 위치 수정"
          href="/update-location"
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
        <MyPageMenuItem label="앱 설정" href="/" onClick={handleComingSoonClick} />
        {/* /settings */}
        <MyPageMenuItem label="공지사항" href="/" onClick={handleComingSoonClick} />
        {/* /notice */}
        <MyPageMenuItem label="고객센터" href="/" onClick={handleComingSoonClick} />
        {/* /support */}
        <MyPageMenuItem
          label="약관 및 정책"
          href="/"
          withBorder={false}
          onClick={handleComingSoonClick}
        />
        {/* /terms */}
      </div>
    </div>
  );
};

export default MyPageMenuList;
