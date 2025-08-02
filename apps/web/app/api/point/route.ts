import { sendNotification } from '@/app/actions';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const pointValue = await req.json();

  try {
    const { data: PushAlarmData, error } = await supabase
      .from('point')
      .select(
        ` 
          point
        `
      )
      .order('created_at', { ascending: false })
      .eq('user_id', pointValue.user_id)
      .eq('reason', pointValue.reason);

    if (error || !PushAlarmData) {
      throw new Error(`pushAlarm 조회 실패: ${error.message}`);
    }

    //포인트 알림 전송
    const { error: exhibitAlarmError } = await sendNotification(
      `${pointValue.user_id}`,
      'point',
      'pointAdded',
      { amount: PushAlarmData[0]?.point }
    );

    if (exhibitAlarmError) {
      throw new Error(` 출품자 포인트 알림 전송 실패: ${exhibitAlarmError}`);
    }
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
