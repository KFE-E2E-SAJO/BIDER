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

  return data;
};
