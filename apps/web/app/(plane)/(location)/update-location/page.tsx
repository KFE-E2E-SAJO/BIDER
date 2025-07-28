'use client';
import { useLocationStore } from '@/features/location/model/useLocationStore';
import LocationWrapper from '@/features/location/ui/LocationWrapper';

const UpdateLocationPage = () => {
  const setStep = useLocationStore((state) => state.setStep);
  setStep('confirm');
  return <LocationWrapper />;
};

export default UpdateLocationPage;
