import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const redirectPage = req.nextUrl.pathname;

  // Supabase 미들웨어 클라이언트 생성
  const supabase = createMiddlewareClient({ req, res });

  // 세션 정보 가져오기
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  // 유저 위치 설정 여부 확인
  let hasAddress = false;
  if (isLoggedIn) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('address')
        .eq('user_id', session.user.id)
        .single();

      hasAddress = !!profile?.address;
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  }

  const protectedRoutes = ['/profile', '/settings', '/my-page', '/product'];
  const authRoutes = ['/login', '/signup'];

  // 페이지가 "/setLocation" 인 경우(무한 리다이렉트 인 경우)
  if (redirectPage.startsWith('/setLocation')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // 페이지가 "/" 인 경우(무한 리다이렉트 인 경우)
  if (redirectPage === '/') {
    if (isLoggedIn && !hasAddress) {
      return NextResponse.redirect(new URL('/setLocation', req.url));
    }
  }

  if (protectedRoutes.some((page) => redirectPage.startsWith(page))) {
    if (isLoggedIn) {
      if (!hasAddress) {
        return NextResponse.redirect(new URL('/setLocation', req.url));
      }
    } else {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (authRoutes.some((page) => redirectPage.startsWith(page))) {
    if (isLoggedIn) {
      if (hasAddress) {
        return NextResponse.redirect(new URL('/', req.url));
      } else {
        return NextResponse.redirect(new URL('/setLocation', req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
