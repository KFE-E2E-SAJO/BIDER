'use server';

import getUserId from '@/shared/lib/getUserId';
import { supabase } from '@/shared/lib/supabaseClient';

export const getYourNickName = async (chatRoomId: string) => {
  const userId = await getUserId();
  const { data, error } = await supabase.rpc('get_other_nickname_by_chatroom', {
    current_user_id: userId,
    chatroom_id_input: chatRoomId,
  });

  if (error) {
    throw new Error(`상대방 닉네임 조회 실패: ${error.message}`);
  }

  return data as string | null;
};
