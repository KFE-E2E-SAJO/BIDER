import { sendNotification } from '@/app/actions';
import { getPointValue } from '@/features/point/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const pointValue = await req.json();

  try {
    let point;
    if (pointValue.type === 'accepted') {
      point = getPointValue(pointValue.reason);
    } else {
      point = getPointValue(pointValue.reason, { bidAmount: pointValue.price });
    }

    //포인트 알림 전송
    const { error: exhibitAlarmError } = await sendNotification(
      `${pointValue.user_id}`,
      'point',
      'pointAdded',
      { amount: point }
    );

    if (exhibitAlarmError) {
      throw new Error(` 출품자 포인트 알림 전송 실패: ${exhibitAlarmError}`);
    }
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
