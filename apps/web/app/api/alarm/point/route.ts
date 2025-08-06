import { sendNotification } from '@/app/actions';
import { getPointValue } from '@/features/point/lib/utils';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const pointValue = await req.json();

  try {
    let point;
    let user_id;

    if (pointValue.type === 'accepted') {
      point = getPointValue(pointValue.reason);
      user_id = pointValue.user_id;
    } else if (pointValue.type === 'pending') {
      point = getPointValue(pointValue.reason, { bidAmount: pointValue.price });
      user_id = pointValue.user_id;
    } else {
      point = getPointValue(pointValue.reason, { bidAmount: pointValue.price });
    }

    if (pointValue.type === 'signup') {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', pointValue.user_id)
        .single();

      if (error) {
        console.error('사용자 조회 오류:', error);
        return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 });
      }

      user_id = data.user_id;
    }

    //포인트 알림 전송
    const { error: exhibitAlarmError } = await sendNotification(
      user_id,
      'point',
      'pointAdded',
      { amount: point },
      pointValue.type === 'signup' ? { allowWithoutToken: true } : undefined
    );

    if (exhibitAlarmError) {
      throw new Error(` 출품자 포인트 알림 전송 실패: ${exhibitAlarmError}`);
    }
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
