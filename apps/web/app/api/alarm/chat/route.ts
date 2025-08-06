import { sendNotification } from '@/app/actions';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

type ChatRoomPayload = {
  bid_user_id: string;
  exhibit_user_id: string;
  auction?: {
    product?: {
      title?: string;
      product_image?: {
        image_url: string;
        order_index: number;
      }[];
    };
  };
};

type ProfilePayload = {
  nickname: string;
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const chatValue = await req.json();

    const { data: chatDataList, error: chatError } = await supabase
      .from('chat_room')
      .select(
        `
        bid_user_id,
        exhibit_user_id,
        auction (
          product (
            title,
            product_image (
              image_url,
              order_index
            )
          )
        )
      `
      )
      .eq('chatroom_id', chatValue.chatroom_id)
      .returns<ChatRoomPayload[]>();

    if (chatError || !chatDataList || chatDataList.length === 0) {
      throw new Error(`chat_room 조회 실패: ${chatError?.message}`);
    }

    const chatData = chatDataList[0];
    if (!chatData) {
      throw new Error('chat_room 데이터가 없습니다.');
    }

    const receiver_id =
      chatValue.sender_id === chatData.bid_user_id
        ? chatData.exhibit_user_id
        : chatData.bid_user_id;

    const { data: senderProfile, error: senderError } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('user_id', chatValue.sender_id)
      .single<ProfilePayload>();

    if (senderError || !senderProfile) {
      console.error('sender 프로필 조회 실패:', senderError);
      throw new Error(`sender 프로필 조회 실패: ${senderError?.message}`);
    }

    const image = chatData.auction?.product?.product_image?.[0]?.image_url ?? '';

    const { error: alarmError } = await sendNotification(`${receiver_id}`, 'chat', 'newMessage', {
      nickname: senderProfile.nickname,
      chatroomId: chatValue.chatroom_id,
      image,
    });

    if (alarmError) {
      console.error('알림 전송 실패:', alarmError);
      throw new Error(`알림 전송 실패: ${String(alarmError)}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: '알림 전송이 완료되었습니다',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('알림 전송 오류:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
