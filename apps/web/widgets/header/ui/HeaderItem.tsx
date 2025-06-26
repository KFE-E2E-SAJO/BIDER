'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Bell, House, Search } from 'lucide-react';
import BackBtn from '@/shared/ui/button/BackBtn';
import TrashBtn from '@/shared/ui/button/TrashBtn';
import Logo from '@/shared/ui/icon/Logo';
import AlertBadge from '@/shared/ui/badge/AlertBadge';

const HEADER_TITLE_MAP: Record<string, React.ReactNode> = {
  '/': <Logo />,
  '/category': <span className="typo-subtitle-medium">카테고리</span>,
  '/chat': <span className="typo-subtitle-medium">채팅</span>,
  '/mypage': <span className="typo-subtitle-medium">마이페이지</span>,
};

const HEADER_CENTER_TEXT_MAP: Record<string, string> = {
  '/product/registration': '출품하기',
  '/alert': '알림',
};

const HeaderItem = ({ hasNewAlert }: { hasNewAlert: boolean }) => {
  const pathname = usePathname();

  const isAuthPage = ['/splash', '/logIn', '/signIn'].includes(pathname);

  const headerTitle = HEADER_TITLE_MAP[pathname];
  const centerLabel = HEADER_CENTER_TEXT_MAP[pathname];

  return (
    <>
      {isAuthPage ? (
        <BackBtn />
      ) : (
        <>
          <div>
            {headerTitle ? (
              <h1 className="typo-subtitle-medium">{headerTitle}</h1>
            ) : (
              <div className="flex items-baseline">
                <BackBtn />
                <House className="ml-4" />
              </div>
            )}
          </div>

          {centerLabel && (
            <div className="typo-subtitle-medium absolute bottom-[10px] left-1/2 -translate-x-1/2 transform">
              <span>{centerLabel}</span>
            </div>
          )}

          <div className="flex items-center justify-end">
            {pathname === '/alert' ? (
              <TrashBtn />
            ) : (
              <>
                <Link href="/search">
                  <Search className="mr-4.5" />
                </Link>
                <Link href="/alert" className="relative">
                  <Bell />
                  {hasNewAlert && <AlertBadge />}
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default HeaderItem;
