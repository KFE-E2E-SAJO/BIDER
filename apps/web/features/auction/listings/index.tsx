import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import AuctionTopTabs from '../shared/ui/AuctionTaopTabs';
import ListingList from './ui/ListingList';

// 출품내역

const AuctionListings = () => {
  const items = [
    { value: 'all', label: '전체', content: <ListingList filter="all" /> },
    { value: 'pending', label: '대기', content: <ListingList filter="pending" /> },
    { value: 'progress', label: '경매 진행 중', content: <ListingList filter="progress" /> },
    { value: 'win', label: '낙찰', content: <ListingList filter="win" /> },
    { value: 'fail', label: '유찰', content: <ListingList filter="fail" /> },
  ];

  return (
    <div className="h-screen overflow-y-scroll">
      <AuctionTopTabs />
      <Tabs defaultValue="all" items={items} className="py-[16px]" />
    </div>
  );
};

export default AuctionListings;
