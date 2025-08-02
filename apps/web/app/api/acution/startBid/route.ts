import { sendNotification } from '@/app/actions';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const startBIdValue = await req.json();

  try {
    const { data: PushAlarmData, error } = await supabase
      .from('product')
      .select(`exhibit_user_id, title, product_image (image_url)`)
      .eq('product_id', startBIdValue.product_id);

    if (error || !PushAlarmData) {
      throw new Error(`pushAlarm 조회 실패: ${error.message}`);
    }

    const exhibit_user_id = PushAlarmData[0]?.exhibit_user_id;

    const { success: result, error: pushAlarmError } = await sendNotification(
      `${exhibit_user_id}`,
      'auction',
      'auctionStarted',
      {
        productName: `${PushAlarmData?.[0]?.title}`,
        auctionId: `${startBIdValue.auction_id}`,
        image: `${PushAlarmData?.[0]?.product_image[0]?.image_url}`,
      }
    );

    if (pushAlarmError) {
      throw new Error(`pushAlarm 전송 실패: ${pushAlarmError}`);
    }
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
