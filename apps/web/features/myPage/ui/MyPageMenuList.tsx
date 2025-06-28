import StatusBadge from '@/shared/ui/badge/StatusBadge';
import { Heart, MapPin } from 'lucide-react';
import { Button } from '@repo/ui/components/Button/Button';
import MyPageMenuItem from './MyPageMenuItem';

const MyPageMenuList = () => {
  return (
    <div>
      <ul className="p-box border-t-8 border-neutral-100 py-[15px]">
        <MyPageMenuItem
          label="받은 후기"
          href="/reviews"
          rightElement={
            <StatusBadge
              type="count-gray"
              label="99+"
              className="absolute right-11 top-[50%] translate-y-[-50%]"
            />
          }
        />
        <MyPageMenuItem
          label="관심 상품"
          href="/likes"
          rightElement={
            <Heart className="fill-danger absolute right-11 top-[50%] translate-y-[-50%] stroke-0" />
          }
        />
        <MyPageMenuItem label="최근 본 상품" href="/recent" />
        <MyPageMenuItem
          label="키워드 알림 설정"
          href="/alerts"
          rightElement={
            <StatusBadge
              type="count-gray"
              label="5"
              className="absolute right-11 top-[50%] translate-y-[-50%]"
            />
          }
        />
        <MyPageMenuItem
          label="내 위치 수정"
          href="/location"
          rightElement={
            <Button
              shape="rounded"
              size="fit"
              className="typo-caption-regular absolute right-11 top-[50%] h-[29px] translate-y-[-50%] gap-1 bg-neutral-900"
            >
              <MapPin className="size-5 stroke-1" /> 강남구 역삼동
            </Button>
          }
          withBorder={false}
        />
      </ul>

      <ul className="p-box border-t-8 border-neutral-100 py-[15px]">
        <MyPageMenuItem label="앱 설정" href="/settings" />
        <MyPageMenuItem label="공지사항" href="/notice" />
        <MyPageMenuItem label="고객센터" href="/support" />
        <MyPageMenuItem label="약관 및 정책" href="/terms" withBorder={false} />
      </ul>
    </div>
  );
};

export default MyPageMenuList;
