import Footer from '@/widgets/footer/Footer';
import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

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

      <div className="p-box py-[25px]">
        <div className="mb-[13px] flex w-full items-baseline justify-between">
          <div className="typo-subtitle-small-medium">나의 경매</div>
          <Link href="/auction" className="typo-caption-regular text-neutral-600">
            전체 보기
            <ChevronRight className="mt-[-3px] inline size-5 stroke-neutral-400 stroke-1" />
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <ul className="flex w-[45%] rounded-md bg-[#f6f6f6]">
            <li className="flex w-1/2 flex-col items-center py-[11px]">
              <p className="text-[11px] text-neutral-600">입찰 전체</p>
              <div className="pt-[3px] text-[18px] font-semibold">40</div>
            </li>
            <li className="flex w-1/2 flex-col items-center py-[11px]">
              <p className="text-[11px] text-neutral-600">진행 중</p>
              <div className="pt-[3px] text-[18px] font-semibold">2</div>
            </li>
          </ul>
          <ul className="flex w-[45%] rounded-md bg-[#f6f6f6]">
            <li className="flex w-1/2 flex-col items-center py-[11px]">
              <p className="text-[11px] text-neutral-600">출품 전체</p>
              <div className="pt-[3px] text-[18px] font-semibold">5</div>
            </li>
            <li className="flex w-1/2 flex-col items-center py-[11px]">
              <p className="text-[11px] text-neutral-600">진행 중</p>
              <div className="pt-[3px] text-[18px] font-semibold">2</div>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <ul className="p-box border-t-8 border-neutral-100 py-[15px]">
          <Link
            href=""
            className="flex items-center justify-between border-b border-neutral-100 py-[15px]"
          >
            <p>받은 후기</p>
            <ChevronRight className="mt-[-3px] inline size-5 stroke-neutral-400 stroke-1" />
          </Link>
          <Link
            href=""
            className="flex items-center justify-between border-b border-neutral-100 py-[15px]"
          >
            <p>관심 상품</p>
            <ChevronRight className="mt-[-3px] inline size-5 stroke-neutral-400 stroke-1" />
          </Link>
          <Link
            href=""
            className="flex items-center justify-between border-b border-neutral-100 py-[15px]"
          >
            <p>최근 본 상품</p>
            <ChevronRight className="mt-[-3px] inline size-5 stroke-neutral-400 stroke-1" />
          </Link>
          <Link
            href=""
            className="flex items-center justify-between border-b border-neutral-100 py-[15px]"
          >
            <p>키워드 알림 설정</p>
            <ChevronRight className="mt-[-3px] inline size-5 stroke-neutral-400 stroke-1" />
          </Link>
          <Link href="" className="flex items-center justify-between py-[15px]">
            <p>내 위치 수정</p>
            <ChevronRight className="mt-[-3px] inline size-5 stroke-neutral-400 stroke-1" />
          </Link>
        </ul>
        <ul className="p-box border-t-8 border-neutral-100 py-[15px]">
          <Link
            href=""
            className="flex items-center justify-between border-b border-neutral-100 py-[15px]"
          >
            <p>앱 설정</p>
            <ChevronRight className="mt-[-3px] inline size-5 stroke-neutral-400 stroke-1" />
          </Link>
          <Link
            href=""
            className="flex items-center justify-between border-b border-neutral-100 py-[15px]"
          >
            <p>공지사항</p>
            <ChevronRight className="mt-[-3px] inline size-5 stroke-neutral-400 stroke-1" />
          </Link>
          <Link
            href=""
            className="flex items-center justify-between border-b border-neutral-100 py-[15px]"
          >
            <p>고객센터</p>
            <ChevronRight className="mt-[-3px] inline size-5 stroke-neutral-400 stroke-1" />
          </Link>
          <Link href="" className="flex items-center justify-between py-[15px]">
            <p>약관 및 정책</p>
            <ChevronRight className="mt-[-3px] inline size-5 stroke-neutral-400 stroke-1" />
          </Link>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default MyPage;
