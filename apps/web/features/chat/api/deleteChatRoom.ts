export const deleteChatRoom = async (chatroomId: string) => {
  const res = await fetch(`/api/chat-rooms/${chatroomId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('채팅방 삭제 실패');
  return true;
};
