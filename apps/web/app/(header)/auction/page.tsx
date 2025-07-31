import AuctionListWrapper from '@/features/auction/list/ui/AuctionListWrapper';
import AuctionListClientPage from '@/features/auction/list/ui/AuctionListClientPage';
import { getUserLocationAction } from '@/features/location/actions/getUserLocationAction';

const AuctionListPage = async () => {
  const userLocation = await getUserLocationAction();
  if (!userLocation) return null;

  return (
    <AuctionListWrapper>
      <AuctionListClientPage userLocation={userLocation} />
    </AuctionListWrapper>
  );
};

export default AuctionListPage;
