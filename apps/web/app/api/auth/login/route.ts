import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { fullEmail, password } = await req.json();
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email: fullEmail,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json({ error: error }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('nickname, address')
    .eq('user_id', data.user.id)
    .single();

  if (profileError) {
    console.error('프로필 조회 실패', profileError);
  }

  const hasAddress = !!profile?.address;

  const response = NextResponse.json({ success: true, user: data.user });

  response.cookies.set('user-has-address', String(hasAddress), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    httpOnly: true,
  });

  return response;
}
