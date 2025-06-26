'use client';
import Intro1 from '@/features/location/ui/Intro1';
import Intro2 from '@/features/location/ui/Intro2';
import Intro3 from '@/features/location/ui/Intro3';
import { useState } from 'react';

export const IntroWrapper = () => {
  const [step, setStep] = useState(0);
  const goNext = () => setStep((prev) => prev + 1);

  if (step === 0) return <Intro1 onNext={goNext} />;
  if (step === 1) return <Intro2 onNext={goNext} />;
  if (step === 2) return <Intro3 onNext={goNext} />;
  return null;
};
