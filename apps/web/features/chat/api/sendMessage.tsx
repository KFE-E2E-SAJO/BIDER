export const sendMessage = async (content: string, userId: string, chatroomId: string) => {
  const response = await fetch(`/api/chat-rooms/${chatroomId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      userId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to send message');
  }

  const result = await response.json();
  return result.data; // 전송된 메시지 데이터 반환
};
