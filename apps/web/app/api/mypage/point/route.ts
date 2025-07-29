import { getPointValue, validateReason } from '@/features/point/lib/utils';
import { PointReason } from '@/features/point/types';
import { createClient } from '@/shared/lib/supabase/server';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const reason = body.reason;
  const bidAmount = body.bidAmount;
  let targetUser = body.targetUser;

  if (targetUser === 'loginUser') {
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

    targetUser = session?.user.id;
  }

  if (!validateReason(reason)) {
    return NextResponse.json(
      { success: false, message: `유효하지 않은 reason 값입니다: ${reason}` },
      { status: 400 }
    );
  }

  const point =
    bidAmount !== undefined
      ? getPointValue(reason as PointReason, { bidAmount: bidAmount })
      : getPointValue(reason as PointReason);

  const { error: pointError } = await supabase.from('point').insert({
    user_id: targetUser,
    point: point,
    reason: reason,
  });

  if (pointError) {
    return NextResponse.json({ success: false, message: pointError.message });
  }

  const { error: profileError } = await supabase.rpc('update_user_point', {
    p_user_id: targetUser,
    amount: point,
  });

  if (profileError) {
    return NextResponse.json({ success: false, message: profileError.message });
  }

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');

  const { data, error } = await supabase
    .from('point')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
