interface SetLocationProps {
  userId: string;
  lat: number;
  lng: number;
  address: string;
}

export const SetLocation = async ({ userId, lat, lng, address }: SetLocationProps) => {
  const res = await fetch('/api/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, lat, lng, address }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '위치 업데이트 실패');
  }
};
