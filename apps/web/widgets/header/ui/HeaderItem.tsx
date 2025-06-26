'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Bell, House, Search } from 'lucide-react';
import BackBtn from '@/shared/ui/button/BackBtn';
import TrashBtn from '@/shared/ui/button/TrashBtn';
import Logo from '@/shared/ui/icon/Logo';

const HeaderItem = ({ hasNewAlert }: { hasNewAlert: boolean }) => {
  const pathname = usePathname();
  const isAuthPage = ['/splash', '/logIn', '/signIn'].includes(pathname);

  return (
    <>
      {isAuthPage ? (
        <BackBtn />
      ) : (
        <>
          <div>
            {pathname === '/' ? (
              <h1>
                <Logo />
              </h1>
            ) : pathname === '/category' ? (
              <h1 className="typo-subtitle-medium">카테고리</h1>
            ) : pathname === '/chat' ? (
              <h1 className="typo-subtitle-medium">채팅</h1>
            ) : pathname === '/mypage' ? (
              <h1 className="typo-subtitle-medium">마이페이지</h1>
            ) : (
              <div className="flex items-baseline">
                <BackBtn />
                <House className="ml-4" />
              </div>
            )}
          </div>
          {pathname === '/product/registration' ? (
            <div className="typo-subtitle-medium absolute bottom-[10px] left-[50%] -translate-x-1/2 transform">
              <span>출품하기</span>
            </div>
          ) : pathname === '/alert' ? (
            <div className="typo-subtitle-medium absolute bottom-[10px] left-[50%] -translate-x-1/2 transform">
              <span>알림</span>
            </div>
          ) : null}
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
                  {hasNewAlert && (
                    <span className="bg-alert absolute right-[-5%] top-[-5%] h-3.5 w-3.5 rounded-full border-2 border-[var(--color-neutral-0)]"></span>
                  )}
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
