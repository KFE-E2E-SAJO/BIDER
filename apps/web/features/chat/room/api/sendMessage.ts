'use server';

import { decodeShortId } from '@/shared/lib/shortUuid';
import { createClient } from '@/shared/lib/supabase/server';
import { supabase } from '@/shared/lib/supabaseClient';

export const sendMessage = async (chatRoomId: string, message: string) => {
  const authSupabase = await createClient();
  const fullChatRoomId = decodeShortId(chatRoomId);

  const {
    data: { session },
  } = await authSupabase.auth.getSession();
  const userId = session?.user.id;

  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }

  const { error } = await supabase.from('message').insert({
    chatroom_id: fullChatRoomId,
    sender_id: userId,
    content: message,
  });

  if (error) {
    throw new Error(`메시지 전송 실패: ${error.message}`);
  }
};
