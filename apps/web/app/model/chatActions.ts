'use server';

import { UUID } from 'crypto';
import { createServerSupabaseAdminClient } from 'shared/lib/supabaseServer';
import { createServerSupabaseClient } from 'shared/lib/supabaseServer';

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

export async function getUserById(user_Id: string) {
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.getUserById(user_Id);

  if (error) {
    return null;
  }

  return data.user;
}

export async function sendMessage({
  content,
  receiver_id,
  chatroom_id,
}: {
  content: string;
  receiver_id: string;
  chatroom_id: string;
}) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session || !session.user) {
    throw new Error('User is not authenticated');
  }
  const { data, error: sendMessageError } = await supabase.from('message').insert({
    content,
    receiver_id: receiver_id,
    sender_id: session.user.id,
    chatroom_id,
    message_type: 'text',
  });
  if (sendMessageError) {
    throw new Error(sendMessageError.message);
  }
  return data;
}

export async function getAllMessages(receiver_id: string) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session || !session.user) {
    throw new Error('User is not authenticated');
  }

  const { data, error: getAllMessagesError } = await supabase
    .from('message')
    .select('*')
    .or(`receiver.eq.${receiver_id},receiver.eq.${session.user.id}`)
    .or(`sender.eq.${receiver_id},sender.eq.${session.user.id}`)
    .order('created_at', { ascending: true });

  if (getAllMessagesError) {
    return [];
  }

  return data;
}
