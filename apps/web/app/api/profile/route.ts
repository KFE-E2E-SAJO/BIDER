import { createClient } from '@/shared/lib/supabase/server';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authSupabase = await createClient();
  const {
    data: { session },
  } = await authSupabase.auth.getSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: '로그인 정보가 없습니다.' },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  const { data, error } = await supabase
    .from('profiles')
    .select('point')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('프로필 포인트 조회 실패:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }

  return NextResponse.json(data);
}
