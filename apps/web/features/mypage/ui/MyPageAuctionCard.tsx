import { AuctionCardProps } from '@/features/mypage/types';

const MyPageAuctionCard = ({ title1, count1, title2, count2 }: AuctionCardProps) => {
  return (
    <ul className="flex w-[47%] rounded-xl bg-[#f6f6f6]">
      <li
        className={`relative flex w-1/2 flex-col items-center py-[11px] after:absolute after:right-0 after:top-1/2 after:h-9 after:w-[1px] after:translate-y-[-50%] after:bg-neutral-300 after:content-['']`}
      >
        <p className="text-[11px] text-neutral-600">{title1}</p>
        <div className="pt-[3px] text-[18px] font-semibold">{count1}</div>
      </li>
      <li className="flex w-1/2 flex-col items-center py-[11px]">
        <p className="text-[11px] text-neutral-600">{title2}</p>
        <div className="pt-[3px] text-[18px] font-semibold">{count2}</div>
      </li>
    </ul>
  );
};

export default MyPageAuctionCard;
