import {
  ChatRoom,
  ChatRoomWithProfile,
  ChatRoomWithMessage,
} from '@/entities/chatRoom/model/types';

export const getChatRoom = async (
  chatroomId: string,
  userId: string
): Promise<ChatRoomWithProfile[] | ChatRoom[] | ChatRoomWithMessage[] | null> => {
  console.log('Fetching chat room data for:', chatroomId);
  const res = await fetch(`/api/chat-rooms/${chatroomId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId, // 👈 커스텀 헤더로 userId 전달!
    },
  });
  console.log('API Response status:', res.status);
  if (!res.ok) {
    console.error('채팅방 API 실패:', res.status);
    return null;
  }

  const data = await res.json();
  console.log('API Response data:', data);
  return data;
};
