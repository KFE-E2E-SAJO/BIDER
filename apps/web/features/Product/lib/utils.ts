import { getCountdown } from '@/shared/lib/getCountdown';

export const getCountdownWithColor = (
  endTime: string | Date
): { text: string; color: 'gray' | 'orange' | 'blue' } => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return { text: getCountdown(endTime), color: 'gray' };

  const minutes = Math.floor(diff / 1000 / 60);
  const color = minutes < 15 ? 'orange' : 'blue';

  return { text: getCountdown(endTime), color };
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
