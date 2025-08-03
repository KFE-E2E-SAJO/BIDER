'use server';

import { decodeShortId } from '@/shared/lib/shortUuid';
import { createClient } from '@/shared/lib/supabase/server';
import { supabase } from '@/shared/lib/supabaseClient';

export const getMessages = async (chatRoomId: string) => {
  const fullChatRoomId = decodeShortId(chatRoomId);

  const { data, error } = await supabase
    .from('message')
    .select(
      `
        *, 
        profile:sender_id (*)
        `
    )
    .eq('chatroom_id', fullChatRoomId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Message 조회 실패: ${error.message}`);
  }

  // 상대 메세지 읽음 처리
  setMessagesRead(fullChatRoomId);
  return data;
};

const setMessagesRead = async (chatRoomId: string) => {
  const authSupabase = await createClient();

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
    .eq('chatroom_id', chatRoomId)
    .neq('sender_id', userId);

  if (error) {
    throw new Error(`메세지 읽음 처리 실패 : ${error.message}`);
  }
};
