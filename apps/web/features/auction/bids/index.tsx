import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import AuctionTopTabs from '@/features/auction/shared/ui/AuctionTopTabs';
import BidList from '@/features/auction/bids/ui/BidList';

const AuctionBids = () => {
  const items = [
    { value: 'all', label: '전체', content: <BidList filter="all" /> },
    { value: 'progress', label: '경매 중', content: <BidList filter="progress" /> },
    { value: 'win', label: '낙찰', content: <BidList filter="win" /> },
    { value: 'fail', label: '패찰', content: <BidList filter="fail" /> },
  ];

  return (
    <div>
      <AuctionTopTabs />
      <Tabs defaultValue="all" items={items} className="py-[16px]" />
    </div>
  );
};
export default AuctionBids;
