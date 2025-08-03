'use server';

import { decodeShortId } from '@/shared/lib/shortUuid';
import { createClient } from '@/shared/lib/supabase/server';
import { supabase } from '@/shared/lib/supabaseClient';

export const setMessagesRead = async (chatRoomId: string) => {
  const authSupabase = await createClient();
  const fullChatRoomId = decodeShortId(chatRoomId);

  const {
    data: { session },
  } = await authSupabase.auth.getSession();
  const userId = session?.user.id;

  if (!userId) {
    throw new Error(`로그인이 필요합니다`);
  }

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
