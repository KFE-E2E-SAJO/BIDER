import { ChatRoomForList } from '@/entities/chatRoom/model/types';

export const getChatList = async (): Promise<ChatRoomForList[] | []> => {
  const baseURL =
    process.env.NODE_ENV === 'production'
      ? 'https://bider-git-feat-chatroom-349-bider-aac1a071.vercel.app'
      : 'http://192.168.0.55:3000';
  // : 'http://localhost:3000';

  const res = await fetch(`${baseURL}/api/chat`);

  if (!res.ok) {
    console.error('채팅 리스트 조회 API 실패:', res.status);
    return [];
  }

  const data = await res.json();
  return data as ChatRoomForList[];
};
