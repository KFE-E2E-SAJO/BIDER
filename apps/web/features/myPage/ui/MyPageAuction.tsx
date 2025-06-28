import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

const MyPageAuction = () => {
  return (
    <div className="p-box py-[25px]">
      <div className="mb-[13px] flex w-full items-baseline justify-between">
        <div className="typo-subtitle-small-medium">나의 경매</div>
        <Link href="/auction" className="typo-caption-regular text-neutral-600">
          전체 보기
          <ChevronRight className="stroke-1.5 mt-[-3px] inline size-5 stroke-neutral-400" />
        </Link>
      </div>
      {/* 각 개수 받아 숫자 세팅 */}
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
  );
};

export default MyPageAuction;
