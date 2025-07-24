'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Bell, House, Search, Trash2 } from 'lucide-react';
import BackBtn from '@/shared/ui/button/BackBtn';
import Logo from '@/shared/ui/icon/Logo';
import AlertBadge from '@/shared/ui/badge/AlertBadge';
import { toast } from '@repo/ui/components/Toast/Sonner';

const HEADER_TITLE_MAP: Record<string, React.ReactNode> = {
  '/': <Logo />,
  '/index': <Logo />,
  '/category': <span className="typo-subtitle-medium">카테고리</span>,
  '/chat': <span className="typo-subtitle-medium">채팅</span>,
  '/mypage': <span className="typo-subtitle-medium">마이페이지</span>,
};

const HEADER_CENTER_TEXT_MAP: Record<string, string> = {
  '/product/registration': '출품하기',
  '/alarm': '알림',
};

const HeaderItem = ({ hasNewAlert }: { hasNewAlert: boolean }) => {
  const pathname = usePathname();

  const headerTitle = HEADER_TITLE_MAP[pathname];
  let centerLabel = HEADER_CENTER_TEXT_MAP[pathname];

  if (pathname.startsWith('/product/edit/')) {
    centerLabel = '상품 수정';
  }

  return (
    <>
      <div>
        {headerTitle ? (
          <h1 className="typo-subtitle-medium">{headerTitle}</h1>
        ) : (
          <div className="flex items-baseline">
            <BackBtn />
            <Link href="/">
              <House className="ml-4" />
            </Link>
          </div>
        )}
      </div>

      {centerLabel && (
        <div className="typo-subtitle-medium absolute bottom-[10px] left-1/2 -translate-x-1/2 transform">
          <span>{centerLabel}</span>
        </div>
      )}

      <div className="flex items-center justify-end">
        {pathname === '/alarm' ? (
          <Trash2 />
        ) : pathname === '/mypage/edit' ? null : (
          <>
            <Link href="/search">
              <Search className="mr-4.5" />
            </Link>
            <Link
              href="/"
              className="relative"
              onClick={() => toast({ content: '준비 중인 기능입니다.' })}
            >
              <Bell />
              {hasNewAlert && <AlertBadge placementClass="absolute right-0 top-0" />}
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default HeaderItem;
