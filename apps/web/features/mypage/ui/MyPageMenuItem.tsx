import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { MyPageMenuItemProps } from '@/features/mypage/types';

const MyPageMenuItem = ({
  label,
  href,
  rightElement,
  withBorder = true,
  onClick,
}: MyPageMenuItemProps) => {
  return (
    <Link
      href={href}
      className={`relative flex items-center justify-between px-[11px] py-[15px] ${
        withBorder ? 'border-b border-neutral-100' : ''
      }`}
      onClick={onClick}
    >
      <p>{label}</p>
      {rightElement}
      <ChevronRight className="mt-[-3px] inline size-6 stroke-neutral-400 stroke-[1.5]" />
    </Link>
  );
};

export default MyPageMenuItem;
