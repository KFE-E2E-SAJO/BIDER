'use server';

import { UUID } from 'crypto';
import { createServerSupabaseAdminClient } from 'shared/lib/supabaseServer';
import { createServerSupabaseClient } from 'shared/lib/supabaseServer';

export async function getAllUsers() {
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.from('chat_room').select(`
    *,
    exhibit_user_id!inner(nickname, profile_img)
  `);

  if (error) {
    console.error('getAllUsers error:', error);
    return [];
  }

  return data.map((chat: any, product_image: any, message: any) => ({
    id: chat.chatroom_id,
    chatroom_id: chat.chatroom_id,
    user: chat.exhibit_user_id?.nickname || '알수없음',
    nickname: chat.exhibit_user_id?.nickname || '알수없음',
    profile_img: chat.exhibit_user_id?.profile_img || 'https://via.placeholder.com/44',
    image_id: product_image?.image_id,
    message: message.content || '메시지가 없습니다',
    time: new Date(chat.updated_at).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    updated_at: chat.updated_at,
    unread: 0, // 실제 읽지 않은 메시지 수 계산 로직 필요
    badge: null, // 배지 로직 필요
    type: 'buy', // 실제 타입 결정 로직 필요
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
  chatroom_id,
}: {
  content: string;
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
  const { data, error: sendMessageError } = await supabase
    .from('message')
    .insert({
      content,
      sender_id: session.user.id,
      chatroom_id,
      is_read: false,
      created_at: new Date().toISOString(),
    })
    .select();
  if (sendMessageError) {
    throw new Error(sendMessageError.message);
  }
  return data;
}

export async function getAllMessages(chatroom_id: string) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session || !session.user) {
    throw new Error('User is not authenticated');
  }

  // 메시지와 채팅방 정보를 조인하여 가져오기
  const { data, error: getAllMessagesError } = await supabase
    .from('message')
    .select(
      `
      *,
      chat_room!inner(
        bid_user_id,
        exhibit_user_id
      )
    `
    )
    .eq('chatroom_id', chatroom_id)
    .order('created_at', { ascending: true });

  if (getAllMessagesError) {
    console.error('getAllMessages error:', getAllMessagesError);
    return [];
  }

  // 현재 사용자가 이 채팅방에 속해있는지 확인
  if (data.length > 0 && data[0]) {
    const chatRoom = data[0].chat_room;
    const isParticipant =
      chatRoom.bid_user_id === session.user.id || chatRoom.exhibit_user_id === session.user.id;

    if (!isParticipant) {
      throw new Error('Access denied to this chat room');
    }
  }

  // 메시지를 읽음 처리
  await markMessagesAsRead(chatroom_id);

  return data.map((message) => ({
    ...message,
    bid_user_id: message.chat_room.bid_user_id,
    exhibit_user_id: message.chat_room.exhibit_user_id,
  }));
}

export async function markMessagesAsRead(chatroom_id: string) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session || !session.user) {
    throw new Error('User is not authenticated');
  }

  // 현재 사용자가 받은 메시지(즉, 상대방이 보낸 메시지)를 읽음 처리
  const { error: updateError } = await supabase
    .from('message')
    .update({ is_read: true })
    .eq('chatroom_id', chatroom_id)
    .neq('sender_id', session.user.id) // 자신이 보낸 메시지가 아닌 것만
    .eq('is_read', false); // 읽지 않은 메시지만

  if (updateError) {
    console.error('markMessagesAsRead error:', updateError);
  }
}
