import { Dot } from 'lucide-react';
import clsx from 'clsx';

interface DotStepperProps {
  activeIndex: number;
}

const DotStepper = ({ activeIndex }: DotStepperProps) => {
  return (
    <div className="text-main mb-[73px] flex">
      {[0, 1, 2].map((i) => (
        <Dot
          key={i}
          strokeWidth={9}
          size={16}
          className={clsx(i === activeIndex ? 'text-main' : 'text-neutral-300')}
        />
      ))}
    </div>
  );
};

export default DotStepper;
