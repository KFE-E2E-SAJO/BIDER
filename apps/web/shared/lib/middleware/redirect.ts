import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '../supabase/server';

export async function handleRedirect(request: NextRequest) {
  const redirectPage = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  let supabaseResponse = NextResponse.next({ request });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Missing Supabase environment variables' }, { status: 500 });
  }

  const supabase = await createClient();

  // JWT 토큰 검증
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  const isLoggedIn = !!user;

  const userHasAddress = request.cookies.get('user-has-address');
  const hasAddress = userHasAddress?.value === 'true';

  const protectedRoutes = [
    '/profile',
    '/settings',
    '/mypage',
    '/product',
    '/search',
    '/category',
    '/auction',
    '/bid',
    '/alarm',
  ];
  const authRoutes = ['/login', '/signup', '/find-id', '/reset-pw'];

  if (redirectPage === '/splash') {
    if (isLoggedIn) {
      if (hasAddress) {
        return NextResponse.redirect(new URL('/', request.url));
      } else {
        return NextResponse.redirect(new URL('/setLocation', request.url));
      }
    }
    return supabaseResponse;
  }

  if (redirectPage.startsWith('/setLocation')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/splash/welcome', request.url));
    }
    if (hasAddress) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return supabaseResponse;
  }

  if (redirectPage === '/') {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/splash/welcome', request.url));
    }
    if (isLoggedIn && !hasAddress) {
      return NextResponse.redirect(new URL('/setLocation', request.url));
    }
    return supabaseResponse;
  }

  if (protectedRoutes.some((page) => redirectPage.startsWith(page))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/splash/welcome', request.url));
    }
    if (isLoggedIn && !hasAddress) {
      return NextResponse.redirect(new URL('/setLocation', request.url));
    }
    return supabaseResponse;
  }

  if (authRoutes.some((page) => redirectPage.startsWith(page))) {
    if (redirectPage === '/signup' && searchParams.get('verified') === 'true') {
      return supabaseResponse;
    }

    if (redirectPage === '/find-id') {
      const type = searchParams.get('type');
      if (!type || (type !== 'email' && type !== 'password')) {
        return NextResponse.redirect(new URL('/find-id?type=email', request.url));
      }
    }

    if (redirectPage === '/reset-pw') {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const refreshToken = searchParams.get('refresh_token');

      if (isLoggedIn) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      if (type === null || token === null || refreshToken === null) {
        return NextResponse.redirect(new URL('/splash/welcome', request.url));
      }

      if (type || token || refreshToken) {
        if (type !== 'recovery' || !token || !refreshToken) {
          return NextResponse.redirect(new URL('/splash/welcome', request.url));
        }
      }

      return supabaseResponse;
    }

    if (isLoggedIn) {
      if (hasAddress) {
        return NextResponse.redirect(new URL('/', request.url));
      } else {
        return NextResponse.redirect(new URL('/setLocation', request.url));
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
