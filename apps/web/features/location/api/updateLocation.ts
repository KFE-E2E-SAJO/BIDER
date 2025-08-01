import { UpdateLocationProps } from '@/features/location/types';

export const updateLocation = async ({ location, address }: UpdateLocationProps) => {
  const { lat, lng } = location;
  const res = await fetch('/api/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng, address }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '위치 업데이트 실패');
  }
};
