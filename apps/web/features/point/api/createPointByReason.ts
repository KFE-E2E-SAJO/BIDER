export const createPointByReason = async (
  reason: string,
  targetUser: string,
  bidAmount?: number
) => {
  const body = JSON.stringify(
    bidAmount !== undefined ? { reason, targetUser, bidAmount } : { reason, targetUser }
  );

  const response = await fetch(`/api/mypage/point`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || '포인트 반영 중 오류가 발생했습니다.');
  }

  return result;
};
