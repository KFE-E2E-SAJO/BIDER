export const fetchIsChatEnd = async (chatRoomId: string): Promise<boolean> => {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseURL}/api/chat/checkIsChatEnd/${chatRoomId}`);
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || '채팅 종료 여부 확인 실패');
  }

  return result.isChatEnd as boolean;
};
