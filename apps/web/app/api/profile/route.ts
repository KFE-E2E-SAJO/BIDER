import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
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
