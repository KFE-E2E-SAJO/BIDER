import { ApiError } from 'next/dist/server/api-utils';

export const inactiveChat = async (chatRoom: string, exhibitUser: string) => {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseURL}/api/chat`, {
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
