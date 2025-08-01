export const createChatRoom = async (auction: string, exhibitUser: string, bidUser: string) => {
  const res = await fetch('/api/chat/create', {
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
