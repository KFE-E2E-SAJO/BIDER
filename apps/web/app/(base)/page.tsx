import AuctionListWrapper from '@/features/auction/list/ui/AuctionListWrapper';
import HomeClientPage from '@/features/home/ui/HomeClientPage';
import { getAuctionMarkersAction } from '@/features/auction/list/actions/getAuctionMakersAction';
import { getUserLocationAction } from '@/features/location/actions/getUserLocationAction';

const HomePage = async () => {
  const userLocation = await getUserLocationAction();
  const auctionMarkers = await getAuctionMarkersAction();
  if (!userLocation || !auctionMarkers) return null;

  return (
    <AuctionListWrapper>
      <HomeClientPage userLocation={userLocation} auctionMarkers={auctionMarkers} />
    </AuctionListWrapper>
  );
};

export default HomePage;
