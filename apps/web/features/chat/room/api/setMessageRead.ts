'use server';

import getUserId from '@/shared/lib/getUserId';
import { decodeShortId } from '@/shared/lib/shortUuid';
import { supabase } from '@/shared/lib/supabaseClient';

export const setMessagesRead = async (chatRoomId: string) => {
  const fullChatRoomId = decodeShortId(chatRoomId);
  const userId = await getUserId();

  const { error } = await supabase
    .from('message')
    .update({ is_read: true })
    .eq('chatroom_id', fullChatRoomId)
    .neq('sender_id', userId)
    .eq('is_read', false);

  if (error) {
    throw new Error(`메세지 읽음 처리 실패 : ${error.message}`);
  }
};
