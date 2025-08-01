import { getUserLocationAction } from '@/features/location/actions/getUserLocationAction';
import SearchClientPage from '@/features/search/ui/SearchClientPage';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const SearchPage = async () => {
  const userLocation = await getUserLocationAction();
  if (!userLocation) return null;
  return (
    <ReactQueryProvider>
      <SearchClientPage address={userLocation.address} />
    </ReactQueryProvider>
  );
};

export default SearchPage;
