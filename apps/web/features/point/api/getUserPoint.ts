export const getUserPoint = async (userId: string) => {
  const res = await fetch(`/api/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
    },
  });

  if (!res.ok) {
    console.error('회원 포인트 조회 API 실패:', res.status);
    return [];
  }

  const data = await res.json();
  return data;
};
