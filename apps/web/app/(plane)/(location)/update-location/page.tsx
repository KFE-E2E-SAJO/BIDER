'use client';
import { useLocationStore } from '@/features/location/model/useLocationStore';
import LocationWrapper from '@/features/location/ui/LocationWrapper';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

const UpdateLocationPage = () => {
  const setStep = useLocationStore((state) => state.setStep);
  setStep('confirm');
  return (
    <ReactQueryProvider>
      <LocationWrapper />
    </ReactQueryProvider>
  );
};

export default UpdateLocationPage;
