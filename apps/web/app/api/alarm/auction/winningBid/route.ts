import { sendNotification } from '@/app/actions';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

type AuctionWonPayload = {
  auction_id: string;
  product_id: string;
  winning_bid_user_id: string | null;

  product: {
    title: string;
    exhibit_user_id: string;
    product_image: { image_url: string }[];
  };

  profiles: {
    nickname: string;
  } | null; // winning_bid_user_id가 없으면 null일 수 있음
};

type ChatRoomPayload = {
  chatroom_id: string;
};

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
      )
      `
      )
      .eq('auction_id', winnigBIdValue.auction_id)
      .returns<AuctionWonPayload[]>();

    if (error || !PushAlarmData || PushAlarmData.length === 0) {
      throw new Error(`pushAlarm 조회 실패: ${error?.message || 'No data found'}`);
    }

    const exhibit_user_Id = PushAlarmData[0]?.product?.exhibit_user_id;
    const winning_bid_user_id = PushAlarmData[0]?.winning_bid_user_id;

    const { data: chat, error: chatError } = await supabase
      .from('chat_room')
      .select('chatroom_id')
      .eq('bid_user_id', winning_bid_user_id)
      .eq('exhibit_user_id', exhibit_user_Id)
      .returns<ChatRoomPayload[]>();

    if (chatError) {
      console.error('Chat room 조회 실패:', chatError);
    }

    // 출품자 알림 전송
    const { success: test, error: exhibitBidError } = await sendNotification(
      `${exhibit_user_Id}`,
      'auction',
      'auctionEndedWon',
      {
        productName: `${PushAlarmData?.[0]?.product?.title}`,
        nickname: `${PushAlarmData?.[0]?.profiles?.nickname}`,
        chatroomId: `${chat?.[0]?.chatroom_id}`,
        image: `${PushAlarmData?.[0]?.product?.product_image?.[0]?.image_url}`,
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
        chatroomId: `${chat?.[0]?.chatroom_id}`,
        image: `${PushAlarmData?.[0]?.product?.product_image?.[0]?.image_url}`,
      }
    );

    if (winningBIdError) {
      throw new Error(`낙찰 알림 전송 실패: ${winningBIdError}`);
    }

    return NextResponse.json({ success: true, message: '알림 전송 완료' });
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
