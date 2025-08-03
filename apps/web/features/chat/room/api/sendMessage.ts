'use server';

import { decodeShortId } from '@/shared/lib/shortUuid';
import { createClient } from '@/shared/lib/supabase/server';
import { supabase } from '@/shared/lib/supabaseClient';

export const sendMessage = async (chatRoomId: string, message: string) => {
  try {
    const authSupabase = await createClient();
    const fullChatRoomId = decodeShortId(chatRoomId);

    const {
      data: { session },
    } = await authSupabase.auth.getSession();
    const userId = session?.user.id;

    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    const { data, error } = await supabase
      .from('message')
      .insert({
        chatroom_id: fullChatRoomId,
        sender_id: userId,
        content: message,
      })
      .select();

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
