export const getcountdownTemp = (endTime: string | Date): string => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return '마감됨';

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}일`);
  if (hours > 0 || days > 0) parts.push(`${hours}시간`);
  parts.push(`${minutes}분`, `${seconds}초`);

  return parts.join(' ');
};
