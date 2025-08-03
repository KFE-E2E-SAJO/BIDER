export const formatKoreanTime = (isoString: string): string => {
  const date = new Date(isoString);

  // 한국 시간으로 보정 (UTC → KST)
  const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const hours = koreanTime.getHours();
  const minutes = koreanTime.getMinutes();

  const isAM = hours < 12;
  const period = isAM ? '오전' : '오후';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return minutes === 0 ? `${period} ${hour12}시` : `${period} ${hour12}시 ${minutes}분`;
};
