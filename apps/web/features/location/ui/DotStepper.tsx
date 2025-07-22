import { Dot } from 'lucide-react';
import clsx from 'clsx';
import { useLocationStore } from '@/features/location/model/useLocationStore';
import { Step } from '@/features/location/types';

const steps: Step[] = ['intro', 'confirm', 'success'];

const DotStepper = () => {
  const step = useLocationStore((state) => state.step);

  return (
    <div className="text-main mb-[73px] flex">
      {steps.map((s) => (
        <Dot
          key={s}
          strokeWidth={9}
          size={16}
          className={clsx(s === step ? 'text-main' : 'text-neutral-300')}
        />
      ))}
    </div>
  );
};

export default DotStepper;
