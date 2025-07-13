import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  //사용자가 접근하려는 페이지 경로
  const redirectPage = req.nextUrl.pathname;
  console.log('접근하려는 페이지 : ', redirectPage);

  //쿠키에서 로그인 확인(내부적으로 쿠키에서 토큰을 읽어서 session 객체를 생성)
  const authToken = req.cookies.get('sb-nrxemenkpeejarhejbbk-auth-token');
  const isLoggedIn = !!authToken?.value;

  // 유저 위치 설정 여부
  const userHasAddress = req.cookies.get('user-has-address');
  const hasAddress = userHasAddress?.value === 'true';

  const protectedRoutes = ['/profile', '/settings', '/my-page', '/product'];
  const auth = ['/login', '/signup'];

  // 페이지가 "/setLocation" 인 경우(무한 리다이렉트 인 경우)
  if (redirectPage.startsWith('/setLocation')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
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

  if (auth.some((page) => redirectPage.startsWith(page))) {
    if (isLoggedIn) {
      if (hasAddress) {
        return NextResponse.redirect(new URL('/', req.url));
      } else {
        return NextResponse.redirect(new URL('/setLocation', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
