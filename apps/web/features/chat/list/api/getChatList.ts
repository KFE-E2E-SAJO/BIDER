import { ChatRoomForList } from '@/entities/chatRoom/model/types';

export const getChatList = async (): Promise<ChatRoomForList[] | []> => {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const res = await fetch(`${baseURL}/api/chat`);

  if (!res.ok) {
    console.error('채팅 리스트 조회 API 실패:', res.status);
    return [];
  }

  const data = await res.json();
  return data as ChatRoomForList[];
};
