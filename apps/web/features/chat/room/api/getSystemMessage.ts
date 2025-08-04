'use server';

import { SystemMessage } from '@/entities/systemMessage/model/types';
import { decodeShortId } from '@/shared/lib/shortUuid';
import { supabase } from '@/shared/lib/supabaseClient';

export const getSystemMessage = async (chatRoomId: string): Promise<SystemMessage | null> => {
  const fullChatRoomId = decodeShortId(chatRoomId);

  const { data, error } = await supabase
    .from('system_message')
    .select('*')
    .eq('chatroom_id', fullChatRoomId)
    .maybeSingle();

  console.log(data);

  if (error) {
    throw new Error(`System Message 조회 실패: ${error.message}`);
  }

  return data;
};
