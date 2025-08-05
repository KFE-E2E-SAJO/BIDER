'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { supabase } from '@/shared/lib/supabaseClient';

export const getYourNickName = async (chatRoomId: string) => {
  const authSupabase = await createClient();

  const {
    data: { session },
  } = await authSupabase.auth.getSession();
  const userId = session?.user.id;

  if (!userId) {
    throw new Error(`로그인이 필요합니다.`);
  }
  const { data, error } = await supabase.rpc('get_other_nickname_by_chatroom', {
    current_user_id: userId,
    chatroom_id_input: chatRoomId,
  });

  if (error) {
    throw new Error(`상대방 닉네임 조회 실패: ${error.message}`);
  }

  return data as string | null;
};
