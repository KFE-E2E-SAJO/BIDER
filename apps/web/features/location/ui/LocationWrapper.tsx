'use client';

import LocationIntro from '@/features/location/ui/LocationIntro';
import LocationConfirm from '@/features/location/ui/LocationConfirm';
import LocationSuccess from '@/features/location/ui/LocationSuccess';
import { useState } from 'react';

const LocationWrapper = () => {
  const [step, setStep] = useState(0);
  const goNext = () => setStep((prev) => prev + 1);

  return (
    <div className="flex flex-1 flex-col">
      {step === 0 && <LocationIntro onNext={goNext} />}
      {step === 1 && <LocationConfirm onNext={goNext} />}
      {step === 2 && <LocationSuccess />}
    </div>
  );
};

export default LocationWrapper;
