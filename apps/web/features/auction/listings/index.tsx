import AuctionTopTabs from '@/features/auction/shared/ui/AuctionTopTabs';
import ListingList from '@/features/auction/listings/ui/ListingList';
import UrlSyncTabs from '@/features/auction/shared/ui/UrlSyncTabs';

const AuctionListings = () => {
  const items = [
    { value: 'all', label: '전체', content: <ListingList filter="all" /> },
    { value: 'pending', label: '대기', content: <ListingList filter="pending" /> },
    { value: 'progress', label: '경매 중', content: <ListingList filter="progress" /> },
    { value: 'win', label: '낙찰', content: <ListingList filter="win" /> },
    { value: 'fail', label: '유찰', content: <ListingList filter="fail" /> },
  ];

  return (
    <div>
      <AuctionTopTabs />
      <UrlSyncTabs defaultValue="all" items={items} className="py-[16px]" />
    </div>
  );
};

export default AuctionListings;
