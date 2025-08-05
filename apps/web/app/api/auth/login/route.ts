import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/shared/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
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

    const { profile, isFirstLogin } = await getUserProfileAndCheckFirstLogin(data.user.id);

    if (!profile) {
      return NextResponse.json({ error: '유저 정보 없음' }, { status: 404 });
    }

    const hasAddress = !!profile.address;

    cookieStore.set('user-has-address', String(hasAddress), {
      path: '/',
      expires: new Date('2099-12-31'),
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    const userInfo = {
      id: data.user.id,
      email: data.user.email ?? '',
      nickName: profile.nickname || '',
      address: profile.address || '',
    };

    return NextResponse.json({
      success: true,
      user: userInfo,
      session: data.session,
      isFirstLogin,
    });
  } catch (error) {
    console.error('로그인 API 전체 에러:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}

async function getUserProfileAndCheckFirstLogin(userId: string) {
  try {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('nickname, address, created_at')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('유저 조회 실패:', error.message);
      return { profile: null, isFirstLogin: false };
    }

    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const timeDifferenceInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

    const isFirstLogin = timeDifferenceInMinutes <= 2;

    return { profile, isFirstLogin };
  } catch (error) {
    console.error('getUserProfileAndCheckFirstLogin 에러:', error);
    return { profile: null, isFirstLogin: false };
  }
}
