import { Point } from '@/entities/point/model/types';

export const getPointList = async (): Promise<Point[] | []> => {
  const res = await fetch(`/api/mypage/point`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    console.error('포인트 내역 API 실패:', res.status);
    return [];
  }

  const data = await res.json();
  return data as Point[];
};
