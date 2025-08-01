import LocationWrapper from '@/features/location/ui/LocationWrapper';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const SetLocationPage = () => {
  return (
    <ReactQueryProvider>
      <LocationWrapper />
    </ReactQueryProvider>
  );
};

export default SetLocationPage;
