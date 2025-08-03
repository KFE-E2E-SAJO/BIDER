import { sendNotification } from '@/app/actions';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const winnigBIdValue = await req.json();

  try {
    const { data: PushAlarmData, error } = await supabase
      .from('auction')
      .select(
        `          
      product (
        title,
        exhibit_user_id,
        product_image (
          image_url
        )
      )
      `
      )
      .eq('auction_id', winnigBIdValue.auction_id);

    if (error || !PushAlarmData) {
      throw new Error(`pushAlarm 조회 실패: ${error.message}`);
    }

    const user_id = PushAlarmData[0]?.product?.exhibit_user_id;

    //유찰 알림 전송
    const { success: result, error: pushAlarmError } = await sendNotification(
      `${user_id}`,
      'auction',
      'auctionEndedLost',
      {
        productName: `${PushAlarmData?.[0]?.product?.title}`,
        image: `${PushAlarmData?.[0]?.product[0]?.product_image[0]?.image_url}`,
      }
    );

    if (pushAlarmError) {
      throw new Error(` 유찰 알림 전송 실패: ${pushAlarmError}`);
    }
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
