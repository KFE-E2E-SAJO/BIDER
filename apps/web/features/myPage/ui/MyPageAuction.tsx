import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import MyPageAuctionCard from './MyPageAuctionCard';

const MyPageAuction = () => {
  return (
    <div className="p-box py-[25px]">
      <div className="mb-[13px] flex w-full items-baseline justify-between">
        <div className="typo-subtitle-small-medium">나의 경매</div>
        <Link href="/auction/bids" className="typo-caption-regular text-neutral-600">
          전체 보기
          <ChevronRight className="stroke-1.5 mt-[-3px] inline size-5 stroke-neutral-400" />
        </Link>
      </div>
      {/* 각 개수 받아 숫자 세팅 */}
      <div className="flex items-center justify-between">
        <MyPageAuctionCard title1="입찰 전체" count1={40} title2="진행 중" count2={2} />
        <MyPageAuctionCard title1="출품 전체" count1={5} title2="진행 중" count2={2} />
      </div>
    </div>
  );
};

export default MyPageAuction;
