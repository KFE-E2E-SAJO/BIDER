import { NextResponse, NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function handleRedirect(request: NextRequest) {
  const redirectPage = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  let supabaseResponse = NextResponse.next({ request });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Missing Supabase environment variables' }, { status: 500 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        // 쿠키 읽기
        getAll() {
          return request.cookies.getAll();
        },

        // 쿠키 쓰기(토큰 자동 갱신)
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // JWT 토큰 검증
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
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

      if (!token || type !== 'recovery') {
        return NextResponse.redirect(new URL('/splash/welcome', request.url));
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth|.*\\.css|.*\\.js|.*\\.map).*)'],
};
