import { Location } from '@/features/location/types';

export const getUserLocation = async (userId: string): Promise<Location> => {
  const res = await fetch(`/api/location?userId=${userId}`);

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '유저 위치 조회 실패');
  }
  const result = await res.json();
  return result.data;
};
