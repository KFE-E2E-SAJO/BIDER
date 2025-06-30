import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import AuctionTopTabs from '../shared/ui/AuctionTaopTabs';

// 출품내역

const AuctionListings = () => {
  const items = [
    { value: 'all', label: '전체', content: '계정 설정 화면' },
    { value: 'a', label: '경매 대기', content: '경매 진행 중 화면' },
    { value: 'b', label: '경매 진행 중', content: '낙찰 화면' },
    { value: 'c', label: '낙찰', content: '패찰 화면' },
    { value: 'd', label: '유찰', content: '유찰 화면' },
    { value: 'e', label: '유찰', content: '유찰 화면' },
    { value: 'f', label: '유찰', content: '유찰 화면' },
  ];

  return (
    <div>
      <AuctionTopTabs />

      <Tabs defaultValue="all" items={items} className="py-[16px]" />
    </div>
  );
};

export default AuctionListings;
