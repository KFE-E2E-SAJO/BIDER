export function getTimeAgo(timestamp: string | Date): string {
  const now = new Date();
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

  const diffMs = now.getTime() - date.getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(diffMs / 1000 / 60 / 60);
  const days = Math.floor(diffMs / 1000 / 60 / 60 / 24);

  const nowY = now.getFullYear();
  const nowM = now.getMonth();
  const nowD = now.getDate();

  const dateY = date.getFullYear();
  const dateM = date.getMonth();
  const dateD = date.getDate();

  // 1분 이내
  if (seconds < 60) return '방금 전';

  // 60분 이내
  if (minutes < 60) return `${minutes}분 전`;

  // 24시간 이내
  if (hours < 24) return `${hours}시간 전`;

  // 어제
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    dateY === yesterday.getFullYear() &&
    dateM === yesterday.getMonth() &&
    dateD === yesterday.getDate()
  ) {
    return '어제';
  }

  // 7일 미만
  if (days < 7) return `${days}일 전`;

  // 같은 해
  if (nowY === dateY) {
    return `${(dateM + 1).toString().padStart(2, '0')}월 ${dateD.toString().padStart(2, '0')}일`;
  }

  // 다른 해
  return `${dateY}년 ${(dateM + 1).toString().padStart(2, '0')}월 ${dateD
    .toString()
    .padStart(2, '0')}일`;
}
