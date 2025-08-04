export const createChatRoom = async (auction: string, exhibitUser: string, bidUser: string) => {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseURL}/api/chat/create`, {
    method: 'POST',
    body: JSON.stringify({
      auction,
      exhibitUser,
      bidUser,
    }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || '채팅방 생성 실패');
  }

  return res.json();
};
