import { Point } from '@/entities/point/model/types';
import { getPointList } from '@/features/point/api/getPointList';
import { useQuery } from '@tanstack/react-query';

export const useGetPointList = (userId: string) => {
  return useQuery<Point[] | []>({
    queryKey: ['pointList', userId],
    queryFn: () => getPointList(),
    enabled: !!userId,
    staleTime: 1000 * 60 * 1,
  });
};
