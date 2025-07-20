import { ChatRoom } from '@/entities/chatRoom/model/types';

export const getChatList = async (userId: string): Promise<ChatRoom[]> => {
  const res = await fetch(`/api/chat-rooms?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    console.error('채팅방 API 실패:', res.status);
    return [];
  }

  const data = await res.json();
  return data as ChatRoom[];
};
