'use server';

import getUserId from '@/shared/lib/getUserId';
import { decodeShortId } from '@/shared/lib/shortUuid';
import { supabase } from '@/shared/lib/supabaseClient';

export const sendMessage = async (chatRoomId: string, message: string, location?: string) => {
  try {
    const userId = await getUserId();
    const fullChatRoomId = decodeShortId(chatRoomId);

    const { data, error } = await supabase
      .from('message')
      .insert({
        chatroom_id: fullChatRoomId,
        sender_id: userId,
        content: message,
      })
      .select();

    if (!location) {
      throw new Error('sendMessage 실패: location (origin) 값이 전달되지 않았습니다.');
    }

    await fetch(`${location}/api/alarm/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatroom_id: fullChatRoomId,
        sender_id: userId,
      }),
    });

    if (error) {
      console.error('메시지 전송 에러:', error);
      throw new Error(`메시지 전송 실패: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('sendMessage 함수 에러:', error);
    throw error;
  }
};
