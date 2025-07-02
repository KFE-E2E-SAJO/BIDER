import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import AuctionTopTabs from '../shared/ui/AuctionTaopTabs';
import BidList from './ui/BidList';

//입찰 내역

const AuctionBids = () => {
  const items = [
    { value: 'all', label: '전체', content: <BidList filter="all" /> },
    { value: 'progress', label: '경매 진행 중', content: <BidList filter="progress" /> },
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
