import { ApiError } from 'next/dist/server/api-utils';

export const inactiveChat = async (chatRoom: string, exhibitUser: string) => {
  const res = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      chatRoom,
      exhibitUser,
    }),
  });

  if (!res.ok) {
    const errorData: ApiError = await res.json();
    console.error(errorData.message);
    throw new Error(errorData.message || '채팅 나가기 실패');
  }

  return res.json();
};
