import { NextResponse, NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function handleRedirect(request: NextRequest) {
  const redirectPage = request.nextUrl.pathname;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        //쿠키 읽기
        getAll() {
          return request.cookies.getAll();
        },

        //쿠키 쓰기(토큰 자동 갱신)
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

  //JWT 토큰 검증
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const userHasAddress = request.cookies.get('user-has-address');
  const hasAddress = userHasAddress?.value === 'true';

  const protectedRoutes = ['/profile', '/settings', '/my-page', '/product'];
  const authRoutes = ['/login', '/signup'];

  // 페이지가 "/setLocation" 인 경우
  if (redirectPage.startsWith('/setLocation')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return supabaseResponse;
  }

  // 페이지가 "/" 인 경우
  if (redirectPage === '/') {
    if (isLoggedIn && !hasAddress) {
      return NextResponse.redirect(new URL('/setLocation', request.url));
    }
  }

  if (protectedRoutes.some((page) => redirectPage.startsWith(page))) {
    if (isLoggedIn) {
      if (!hasAddress) {
        return NextResponse.redirect(new URL('/setLocation', request.url));
      }
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (authRoutes.some((page) => redirectPage.startsWith(page))) {
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
