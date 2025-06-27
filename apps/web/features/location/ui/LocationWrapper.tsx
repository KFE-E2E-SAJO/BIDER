'use client';

import LocationIntro from '@/features/location/ui/LocationIntro';
import LocationConfirm from '@/features/location/ui/LocationConfirm';
import LocationSuccess from '@/features/location/ui/LocationSuccess';
import { useState } from 'react';

const LocationWrapper = () => {
  const [step, setStep] = useState(0);
  const goNext = () => setStep((prev) => prev + 1);

  if (step === 0) return <LocationIntro onNext={goNext} />;
  if (step === 1) return <LocationConfirm onNext={goNext} />;
  if (step === 2) return <LocationSuccess />;
  return null;
};

export default LocationWrapper;
