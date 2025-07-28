export const createPointByReason = async (reason: string) => {
  const response = await fetch(`/api/mypage/point`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: reason,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || '포인트 반영 중 오류가 발생했습니다.');
  }

  return result;
};
