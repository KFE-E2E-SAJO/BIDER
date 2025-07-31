'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Bell, House, Search, Settings } from 'lucide-react';
import BackBtn from '@/shared/ui/button/BackBtn';
import Logo from '@/shared/ui/icon/Logo';
import AlertBadge from '@/shared/ui/badge/AlertBadge';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { useChatStore } from '@/features/chat/room/model/chatStore';

// 좌측 타이틀
const HEADER_TITLE_MAP: Record<string, React.ReactNode> = {
  '/': <Logo />,
  '/index': <Logo />,
  '/category': <span className="typo-subtitle-medium">카테고리</span>,
  '/chat': <span className="typo-subtitle-medium">채팅</span>,
  '/mypage': <span className="typo-subtitle-medium">마이페이지</span>,
};

// 중간 타이틀
const HEADER_CENTER_TEXT_MAP: Record<string, string> = {
  '/product/registration': '출품하기',
  '/alarm': '알림',
  '/alarm/setting': '알림 설정',
  '/mypage/proposal/received': '경매 제안',
  '/mypage/proposal/sent': '경매 제안',
};

// 검색,알림 아이콘 노출할 페이지
const SHOW_RIGHTICON = (pathname: string) => {
  return (
    pathname === '/' ||
    pathname === '/index' ||
    pathname === '/category' ||
    pathname === '/chat' ||
    pathname === '/mypage' ||
    pathname === '/product'
  );
};

const HeaderItem = ({ hasNewAlert }: { hasNewAlert: boolean }) => {
  const pathname = usePathname();

  const headerTitle = HEADER_TITLE_MAP[pathname];
  let centerLabel = HEADER_CENTER_TEXT_MAP[pathname];

  const nickname = useChatStore((s) => s.nickname);
  if (pathname.startsWith('/product/edit/')) {
    centerLabel = '상품 수정';
  } else if (pathname.startsWith('/auction/') && pathname.includes('/proposal')) {
    centerLabel = '제안하기';
  } else if (pathname.startsWith('/chat/') && pathname !== '/chat') {
    centerLabel = nickname || '채팅방';
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
          <Settings />
        ) : SHOW_RIGHTICON(pathname) ? (
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
        ) : null}
      </div>
    </>
  );
};

export default HeaderItem;
