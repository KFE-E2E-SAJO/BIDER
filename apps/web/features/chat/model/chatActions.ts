'use server';

import { createServerSupabaseAdminClient } from 'shared/lib/supabaseServer';

export async function getAllUsers() {
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.from('chat_room').select('*');
  if (error) {
    return [];
  }

  return data.map((chat: any) => ({
    id: chat.chatroom_id,
    user: chat.exhibit_user_id.nickname,
    message: chat.message,
    time: new Date(chat.updated_at).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }));
}
