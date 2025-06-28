import Footer from '@/widgets/footer/Footer';
import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { Button } from '@repo/ui/components/Button/Button';
import { ChevronRight, Heart, MapPin } from 'lucide-react';
import Link from 'next/link';
import MyPageAuction from './ui/MyPageAuction';
import StatusBadge from '@/shared/ui/badge/StatusBadge';

const MyPage = () => {
  return (
    <div>
      <div className="mx-[16px] flex items-center justify-between border-b border-neutral-100 pb-[25px] pt-[16px]">
        <div className="flex items-center">
          <Avatar
            className="size-[60px]"
            src="https://i.pinimg.com/originals/36/9a/fb/369afb7c81a3278b1fd8f804cd105b37.jpg"
          />
          <ul className="pl-[22px]">
            <li>입찰매니아</li>
            <li className="typo-caption-regular pt-[4px] text-neutral-600">
              kernel@fastcampus.com
            </li>
          </ul>
        </div>
        <Link
          href="/mypage/edit"
          className="typo-caption-regular border border-neutral-300 px-[20px] py-[6px] text-neutral-700"
        >
          프로필 수정
        </Link>
      </div>

      <MyPageAuction />

      <div>
        <ul className="p-box border-t-8 border-neutral-100 py-[15px]">
          <Link
            href=""
            className="relative flex items-center justify-between border-b border-neutral-100 px-[11px] py-[15px]"
          >
            <p>받은 후기</p>
            {/* 받은 후기 개수 세팅 */}
            <StatusBadge
              type="count-gray"
              label="99+"
              className="absolute right-11 top-[50%] translate-y-[-50%] transform"
            />
            <ChevronRight className="mt-[-3px] inline size-6 stroke-neutral-400 stroke-[1.5]" />
          </Link>

          <Link
            href=""
            className="relative flex items-center justify-between border-b border-neutral-100 px-[11px] py-[15px]"
          >
            <p>관심 상품</p>
            <Heart className="fill-danger absolute right-11 top-[50%] translate-y-[-50%] transform stroke-0" />
            <ChevronRight className="mt-[-3px] inline size-6 stroke-neutral-400 stroke-[1.5]" />
          </Link>

          <Link
            href=""
            className="flex items-center justify-between border-b border-neutral-100 px-[11px] py-[15px]"
          >
            <p>최근 본 상품</p>
            <ChevronRight className="mt-[-3px] inline size-6 stroke-neutral-400 stroke-[1.5]" />
          </Link>

          <Link
            href=""
            className="relative flex items-center justify-between border-b border-neutral-100 px-[11px] py-[15px]"
          >
            <p>키워드 알림 설정</p>
            {/* 키워드 알림 개수 세팅 */}
            <StatusBadge
              type="count-gray"
              label="5"
              className="absolute right-11 top-[50%] translate-y-[-50%] transform"
            />
            <ChevronRight className="mt-[-3px] inline size-6 stroke-neutral-400 stroke-[1.5]" />
          </Link>

          <Link href="" className="relative flex items-center justify-between px-[11px] py-[15px]">
            <p>내 위치 수정</p>
            <Button
              shape="rounded"
              size="fit"
              className="typo-caption-regular absolute right-11 top-[50%] h-[29px] translate-y-[-50%] transform gap-1 bg-neutral-900"
            >
              <MapPin className="size-5 stroke-1" /> 강남구 역삼동
            </Button>
            <ChevronRight className="mt-[-3px] inline size-6 stroke-neutral-400 stroke-[1.5]" />
          </Link>
        </ul>
        <ul className="p-box border-t-8 border-neutral-100 py-[15px]">
          <Link
            href=""
            className="flex items-center justify-between border-b border-neutral-100 px-[11px] py-[15px]"
          >
            <p>앱 설정</p>
            <ChevronRight className="mt-[-3px] inline size-6 stroke-neutral-400 stroke-[1.5]" />
          </Link>

          <Link
            href=""
            className="flex items-center justify-between border-b border-neutral-100 px-[11px] py-[15px]"
          >
            <p>공지사항</p>
            <ChevronRight className="mt-[-3px] inline size-6 stroke-neutral-400 stroke-[1.5]" />
          </Link>

          <Link
            href=""
            className="flex items-center justify-between border-b border-neutral-100 px-[11px] py-[15px]"
          >
            <p>고객센터</p>
            <ChevronRight className="mt-[-3px] inline size-6 stroke-neutral-400 stroke-[1.5]" />
          </Link>

          <Link href="" className="flex items-center justify-between px-[11px] py-[15px]">
            <p>약관 및 정책</p>
            <ChevronRight className="mt-[-3px] inline size-6 stroke-neutral-400 stroke-[1.5]" />
          </Link>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default MyPage;
