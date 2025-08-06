export const getChatRoomIdIfExist = async (
  auctionId: string,
  exhibitUserId: string,
  bidUserId: string
) => {
  const baseURL = 'https://bider-git-test-bider-aac1a071.vercel.app/auction/k8KrqSd6VadqxdNUsSGD8E';
  const res = await fetch(`${baseURL}/api/chat/getChatRoomLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ auctionId, exhibitUserId, bidUserId }),
  });

  if (!res.ok) {
    console.error('채팅 리스트 조회 API 실패:', res.status);
    return null;
  }

  const data = await res.json();
  return data;
};
