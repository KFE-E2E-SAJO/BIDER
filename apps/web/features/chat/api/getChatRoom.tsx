import { ChatRoom } from '@/entities/chatRoom/model/types';

export const getChatRoom = async (chatroomId: string): Promise<ChatRoom[] | null> => {
  console.log('Fetching chat room data for:', chatroomId);
  const res = await fetch(`/api/chat-rooms/${chatroomId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log('API Response status:', res.status);
  if (!res.ok) {
    console.error('채팅방 API 실패:', res.status);
    return null;
  }

  const data = await res.json();
  console.log('API Response data:', data);
  return data as ChatRoom[];
};
