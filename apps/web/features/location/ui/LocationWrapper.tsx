'use client';

import LocationIntro from '@/features/location/ui/LocationIntro';
import LocationConfirm from '@/features/location/ui/LocationConfirm';
import LocationSuccess from '@/features/location/ui/LocationSuccess';
import { useLocationStore } from '@/features/location/model/useLocationStore';

const LocationWrapper = () => {
  const step = useLocationStore((state) => state.step);

  return (
    <div className="flex flex-1 flex-col">
      {step === 'intro' && <LocationIntro />}
      {step === 'confirm' && <LocationConfirm />}
      {step === 'success' && <LocationSuccess />}
    </div>
  );
};

export default LocationWrapper;
