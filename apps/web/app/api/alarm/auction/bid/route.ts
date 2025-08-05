import { sendNotification } from '@/app/actions';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

type MyCustomAuctionWithJoinType = {
  auction_id: string;
  product: {
    title: string;
    product_id: string;
    exhibit_user_id: string;
    product_image: { image_url: string }[];
  };
  bid_history: {
    bid_user_id: string;
    bid_price: number;
    profiles: {
      nickname: string;
    };
  }[];
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const winnigBidValue = await req.json();

  try {
    const { data: PushAlarmData, error } = await supabase
      .from('auction')
      .select(
        `        
          product: (
            title,
            product_id,
            exhibit_user_id,
            product_image (
              image_url
            )
          ),

          bid_history!BidHistory_auction_id_fkey (
            bid_user_id,
            bid_price,
            profiles (
              nickname
            )
          )
        `
      )
      .eq('auction_id', winnigBidValue.auction_id)
      .returns<MyCustomAuctionWithJoinType[]>();

    if (error || !PushAlarmData) {
      throw new Error(`pushAlarm 조회 실패: ${error?.message ?? 'Unknown error'}`);
    }

    const bid_user_id = PushAlarmData[0]?.bid_history[0]?.bid_user_id;
    const exhibit_user_id = PushAlarmData[0]?.product?.exhibit_user_id;

    // 입찰자 알림 전송
    const { error: AlarmError } = await sendNotification(
      `${bid_user_id}`,
      'auction',
      'bidUpdated',
      {
        productName: PushAlarmData[0]?.product?.title,
        auctionId: winnigBidValue.auction_id,
        image: PushAlarmData[0]?.product?.product_image?.[0]?.image_url,
      }
    );

    if (AlarmError) {
      throw new Error(`입찰자 갱신 알림 전송 실패: ${AlarmError}`);
    }

    // 출품자 알림 전송
    const { error: exhibitAlarmError } = await sendNotification(
      `${exhibit_user_id}`,
      'auction',
      'bidNotification',
      {
        nickname: PushAlarmData[0]?.bid_history[0]?.profiles?.nickname,
        productName: PushAlarmData[0]?.product?.title,
        price: PushAlarmData[0]?.bid_history[0]?.bid_price,
        auctionId: winnigBidValue.auction_id,
        image: PushAlarmData[0]?.product?.product_image?.[0]?.image_url,
      }
    );

    if (exhibitAlarmError) {
      throw new Error(`출품자 갱신 알림 전송 실패: ${exhibitAlarmError}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: '알림 전송이 완료되었습니다',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
