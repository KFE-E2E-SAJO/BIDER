'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CirclePlus,
  House,
  LayoutGrid,
  LucideIcon,
  MessageSquareMore,
  UserRound,
} from 'lucide-react';
import AlertBadge from '@/shared/ui/badge/AlertBadge';
import { toast } from '@repo/ui/components/Toast/Sonner';

interface NavItems {
  href: string;
  label: string;
  icon: LucideIcon;
  matchPath: (pathname: string) => boolean;
}

const navItems: NavItems[] = [
  {
    href: '/',
    label: '홈',
    icon: House,
    matchPath: (pathname) => pathname === '/' || pathname === '/index',
  },
  {
    href: '/category',
    label: '카테고리',
    icon: LayoutGrid,
    matchPath: (pathname) => pathname === '/category',
  },
  {
    href: '/product/registration',
    label: '출품하기',
    icon: CirclePlus,
    matchPath: (pathname) => pathname === '/product/registration',
  },
  {
    href: '/',
    // href: '/chat',
    label: '채팅',
    icon: MessageSquareMore,
    matchPath: (pathname) => pathname === '/chat',
  },
  {
    href: '/mypage',
    label: '마이페이지',
    icon: UserRound,
    matchPath: (pathname) => pathname === '/mypage',
  },
];

const Nav = () => {
  const pathname = usePathname();
  const hasNewChat = false; //새로운 채팅 여부 받아오기

  return (
    <nav className="bg-neutral-0 p-box fixed bottom-0 left-1/2 flex w-full max-w-[600px] translate-x-[-50%] items-baseline justify-between border-t border-neutral-100 pb-[40px] pt-[13px]">
      {navItems.map(({ href, label, icon: Icon, matchPath }) => {
        const isActive = matchPath(pathname);
        const isChat = href == '/chat';

        return (
          <Link
            key={label}
            href={href}
            className="relative flex w-1/5 flex-col items-center justify-center"
            onClick={(e) => {
              if (label === '채팅') {
                e.preventDefault();
                toast({ content: '준비 중인 기능입니다.' });
              }
            }}
          >
            <Icon
              className={`w-6 ${isActive ? 'fill-neutral-900 stroke-neutral-900' : 'fill-neutral-0 stroke-neutral-400'}`}
              strokeWidth={1.5}
            />
            {isChat && hasNewChat && (
              <AlertBadge placementClass="absolute left-[50%] top-[-2px] transform translate-x-0.5" />
            )}
            <span
              className={`text-caption pt-1.5 font-[500] ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Nav;
