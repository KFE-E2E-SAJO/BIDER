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
      auction_id,
      product_id,
      winning_bid_user_id,
                
      product (
        title,
        exhibit_user_id,
        product_image (
          image_url
        )
      ),

      profiles:winning_bid_user_id (
        nickname
      ),
      
      chat_room (
       chatroom_id
      )
      `
      )
      .eq('auction_id', winnigBIdValue.auction_id);

    if (error || !PushAlarmData) {
      throw new Error(`pushAlarm 조회 실패: ${error.message}`);
    }

    const exhibit_user_Id = PushAlarmData[0]?.product?.exhibit_user_id;
    const winning_bid_user_id = PushAlarmData[0]?.winning_bid_user_id;

    //출품자 알림 전송
    const { success: test, error: exhibitBidError } = await sendNotification(
      `${exhibit_user_Id}`,
      'auction',
      'auctionEndedWon',
      {
        productName: `${PushAlarmData?.[0]?.product?.title}`,
        nickname: `${PushAlarmData?.[0]?.profiles?.nickname}`,
        chatroomId: `${PushAlarmData?.[0]?.chat_room?.chatroom_id}`,
        image: `${PushAlarmData?.[0]?.product[0]?.product_image?.image_url}`,
      }
    );

    if (exhibitBidError) {
      throw new Error(`낙찰 알림 전송 실패: ${exhibitBidError}`);
    }

    // 낙찰자 알림 전송
    const { error: winningBIdError } = await sendNotification(
      `${winning_bid_user_id}`,
      'auction',
      'auctionWon',
      {
        productName: `${PushAlarmData?.[0]?.product?.title}`,
        nickname: `${PushAlarmData?.[0]?.profiles?.nickname}`,
        chatroomId: `${PushAlarmData?.[0]?.chat_room?.chatroom_id}`,
        image: `${PushAlarmData?.[0]?.product[0]?.product_image[0]?.image_url}`,
      }
    );

    if (winningBIdError) {
      throw new Error(`낙찰 알림 전송 실패: ${winningBIdError}`);
    }
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
