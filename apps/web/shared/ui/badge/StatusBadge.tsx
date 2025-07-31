import { cn } from '@repo/ui/lib/utils';
import { AlarmClock } from 'lucide-react';

interface StatusBadgeProps {
  label: string;
  type: StatusType;
  className?: string;
}

export type StatusType =
  | 'time-orange'
  | 'time-blue'
  | 'time-gray'
  | 'count-blue'
  | 'count-gray'
  | 'count-green'
  | 'state-gray'
  | 'state-lightgray'
  | 'state-orange'
  | 'state-blue'
  | 'state-green';

const baseStyle =
  'inline-flex items-center justify-center py-1 px-2 min-w-7 w-fit text-[10px] font-semibold';
const roundedTypes: StatusType[] = ['count-blue', 'count-gray', 'count-green'];

const colorStyles: Record<StatusType, string> = {
  'time-orange': 'text-warning-medium bg-warning-light',
  'time-blue': 'text-main bg-main-lightest',
  'time-gray': 'text-neutral-700 bg-neutral-100',

  'count-blue': 'text-neutral-0 bg-main',
  'count-gray': 'text-neutral-600 bg-neutral-100',
  'count-green': 'text-neutral-0 bg-alert',

  'state-gray': 'text-neutral-0 bg-neutral-700',
  'state-lightgray': 'text-neutral-700 bg-neutral-100',
  'state-orange': 'text-neutral-0 bg-warning',
  'state-green': 'text-neutral-0 bg-alert',
  'state-blue': 'text-main bg-main-lightest',
};

const StatusBadge = ({ label, type, className }: StatusBadgeProps) => {
  const isTimeType = type.startsWith('time');
  const isRounded = roundedTypes.includes(type);

  return (
    <span
      className={cn(
        baseStyle,
        colorStyles[type],
        isRounded && 'rounded-full',
        isTimeType && 'gap-1',
        className
      )}
    >
      {isTimeType && <AlarmClock className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
};

export default StatusBadge;

/**
 * 사용 예시 (주석 제거 예정)
 * 
 * <StatusBadge type="time-orange" label="12분 남음" />
 * <StatusBadge type="time-blue" label="1시간 59분 남음" />
 * <StatusBadge type="time-gray" label="경매 종료" />

 * <StatusBadge type="count-blue" label="낙찰" />
 * <StatusBadge type="count-gray" label="99+" />
 * <StatusBadge type="count-green" label="1" />

 * <StatusBadge type="state-gray" label="유찰" />
 * <StatusBadge type="state-yellow" label="대기" />
 * <StatusBadge type="state-green" label="낙찰" />
 */
