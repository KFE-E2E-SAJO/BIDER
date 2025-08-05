'use server';

import { SystemMessageWithNickname } from '@/entities/systemMessage/model/types';
import { decodeShortId } from '@/shared/lib/shortUuid';
import { supabase } from '@/shared/lib/supabaseClient';

export const getSystemMessage = async (
  chatRoomId: string
): Promise<SystemMessageWithNickname | null> => {
  const fullChatRoomId = decodeShortId(chatRoomId);

  const { data, error } = await supabase
    .from('system_message')
    .select(
      `
      *,
      bid_user:profiles!system_message_bid_user_id_fkey (
        nickname
      ),
      exhibit_user:profiles!system_message_exhibit_user_id_fkey (
        nickname
      )
      `
    )
    .eq('chatroom_id', fullChatRoomId)
    .maybeSingle();

  if (error) {
    throw new Error(`System Message 조회 실패: ${error.message}`);
  }

  if (!data) return null;

  return {
    ...data,
    bid_user_nickname: data.bid_user?.nickname ?? '낙찰자',
    exhibit_user_nickname: data.exhibit_user?.nickname ?? '출품자',
  };
};
