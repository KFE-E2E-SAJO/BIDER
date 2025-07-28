import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/shared/lib/supabase/server';

export async function POST(req: Request) {
  const { fullEmail, password } = await req.json();
  const cookieStore = await cookies();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: fullEmail,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message ?? '로그인 실패' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('nickname, address')
    .eq('user_id', data.user.id)
    .single();

  if (profileError) console.error('프로필 조회 실패', profileError);

  const hasAddress = !!profile?.address;

  cookieStore.set('user-has-address', String(hasAddress), {
    path: '/',
    expires: new Date('2099-12-31'),
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  const userInfo = {
    id: data.user.id,
    email: data.user.email!,
    nickName: profile?.nickname || '',
    address: profile?.address || '',
  };

  return NextResponse.json({
    success: true,
    user: userInfo,
    session: data.session,
  });
}
