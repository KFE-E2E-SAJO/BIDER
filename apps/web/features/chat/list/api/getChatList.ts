import { ChatRoomForList } from '@/entities/chatRoom/model/types';

export const getChatList = async (): Promise<ChatRoomForList[] | []> => {
  const baseURL = 'https://bider-git-test-bider-aac1a071.vercel.app';

  const res = await fetch(`${baseURL}/api/chat`);

  if (!res.ok) {
    console.error('채팅 리스트 조회 API 실패:', res.status);
    return [];
  }

  const data = await res.json();
  return data as ChatRoomForList[];
};
