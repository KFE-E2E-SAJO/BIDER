import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import AuctionTopTabs from '../shared/ui/AuctionTaopTabs';

//입찰 내역

const AuctionBids = () => {
  const items = [
    { value: 'all', label: '전체', content: '계정 설정 화면' },
    { value: 'a', label: '경매 진행 중', content: '경매 진행 중 화면' },
    { value: 'b', label: '낙찰', content: '낙찰 화면' },
    { value: 'c', label: '패찰', content: '패찰 화면' },
  ];

  return (
    <div>
      <AuctionTopTabs />

      <Tabs defaultValue="all" items={items} className="py-[16px]" />
    </div>
  );
};
export default AuctionBids;
