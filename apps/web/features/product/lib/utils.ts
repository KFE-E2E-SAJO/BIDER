import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';

export const getCountdownWithColor = (
  endTime: string | Date
): { text: string; color: 'gray' | 'orange' | 'blue' } => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return { text: '경매 종료', color: 'gray' };

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const days = totalDays;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  let timeText = '';

  if (totalMinutes >= 1) {
    if (days > 0) timeText += `${days}일 `;
    if (hours > 0) timeText += `${hours}시간 `;
    if (minutes > 0) timeText += `${minutes}분`;
  } else {
    timeText = `${seconds}초`;
  }

  const color = totalMinutes < 15 ? 'orange' : 'blue';

  return {
    text: `${timeText.trim()} 남음`,
    color,
  };
};

export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const parseFormattedPrice = (formattedPrice: string): number => {
  return parseInt(formattedPrice.replace(/,/g, ''), 10);
};

export const formatPriceInput = (value: string): string => {
  const numericOnly = value.replace(/\D/g, '');
  return formatNumberWithComma(numericOnly);
};

export const combineDateTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}`);
};
