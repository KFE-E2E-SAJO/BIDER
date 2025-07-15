'use server';

import { supabase } from '@/shared/lib/supabaseClient';
import { createServerSupabaseAdminClient } from 'shared/lib/supabaseServer';
import { createServerSupabaseClient } from 'shared/lib/supabaseServer';

const message = supabase.channel('message');
const DEFAULT_PROFILE_IMG = '/default-profile.png';

export async function chatRoomsWithImage() {
  const supabase = await createServerSupabaseClient();

  // 1. 채팅방 목록 조회
  const { data: chatRooms } = await supabase.from('chat_room').select('*');
  if (!chatRooms) return [];

  // 2. auction_id 추출
  const auctionIds = chatRooms.map((room) => room.auction_id);

  // 3. auction 테이블에서 product_id 매핑
  const { data: auctions } = await supabase
    .from('auction')
    .select('auction_id, product_id')
    .in('auction_id', auctionIds);
  if (!auctions) return [];

  const productIdMap = new Map(auctions.map((a) => [a.auction_id, a.product_id]));
  const productIds = auctions.map((a) => a.product_id).filter(Boolean);

  // 4. product_image 테이블에서 이미지 조회
  const { data: productImages } = await supabase
    .from('product_image')
    .select('*')
    .in('product_id', productIds);
  console.log('chatRoomsWithImage productImages:', productImages);
  // 5. 매핑
  return chatRooms.map((room) => {
    const product_id = productIdMap.get(room.auction_id);
    const img = productImages?.find((i) => i.product_id === product_id);
    return {
      ...room,
      product_image_url: img?.image_url ?? DEFAULT_PROFILE_IMG,
    };
  });
}

export async function getAllUsers() {
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.from('chat_room').select(`
    *,
    exhibit_user_id!inner(nickname, profile_img)
  `);
  console.log('getAllUsers data:', data);
  if (error) {
    console.error('getAllUsers error:', error);
    return [];
  }

  return data.map((chat: any, product_image: any, message: any) => ({
    id: chat.chatroom_id,
    nickname: chat.exhibit_user_id?.nickname || '알수없음',
    profile_img: chat.exhibit_user_id?.profile_img ?? DEFAULT_PROFILE_IMG,
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
  userId,
}: {
  content: string;
  chatroom_id: string;
  userId: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error: sendMessageError } = await supabase
    .from('message')
    .insert({
      content,
      sender_id: userId,
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

export async function getAllMessages(chatroom_id: string, userId: string) {
  const supabase = await createServerSupabaseClient();

  // 메시지 전부 가져오기
  const { data, error: getAllMessagesError } = await supabase
    .from('message')
    .select(`*`)
    .eq('chatroom_id', chatroom_id)
    .order('created_at', { ascending: true });

  if (getAllMessagesError) {
    console.error('getAllMessages error:', getAllMessagesError);
    return [];
  }
  // 메시지를 읽음 처리
  await markMessagesAsRead(chatroom_id);

  return data;
}
export async function markMessagesAsRead(chatroom_id: string, userId?: string) {
  const supabase = await createServerSupabaseClient();

  // userId가 없으면 모든 메시지를 읽음 처리
  if (!userId) {
    const { error: updateError } = await supabase
      .from('message')
      .update({ is_read: true })
      .eq('chatroom_id', chatroom_id)
      .eq('is_read', false);

    if (updateError) {
      console.error('markMessagesAsRead error:', updateError);
    }
    return;
  }

  // 현재 사용자가 받은 메시지(즉, 상대방이 보낸 메시지)를 읽음 처리
  const { error: updateError } = await supabase
    .from('message')
    .update({ is_read: true })
    .eq('chatroom_id', chatroom_id)
    .neq('sender_id', userId) // 자신이 보낸 메시지가 아닌 것만
    .eq('is_read', false); // 읽지 않은 메시지만

  if (updateError) {
    console.error('markMessagesAsRead error:', updateError);
  }
}
