export const fetchIsChatEnd = async (chatRoomId: string): Promise<boolean> => {
  const baseURL = 'https://bider-git-test-bider-aac1a071.vercel.app';
  const res = await fetch(`${baseURL}/api/chat/checkIsChatEnd/${chatRoomId}`);
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || '채팅 종료 여부 확인 실패');
  }

  return result.isChatEnd as boolean;
};
