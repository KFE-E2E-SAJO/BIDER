import { clsx } from 'clsx';

interface LineProps {
  className?: string;
}

const Line = ({ className }: LineProps) => {
  return <div className={clsx('h-[1px] w-full bg-neutral-100', className)} />;
};

export default Line;
