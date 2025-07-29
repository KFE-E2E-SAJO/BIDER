import { Point } from '@/entities/point/model/types';
import { useQuery } from '@tanstack/react-query';
import { getPointList } from '../api/getPointList';

export const useGetPointList = (userId: string) => {
  return useQuery<Point[] | []>({
    queryKey: ['pointList', userId],
    queryFn: () => getPointList(),
    enabled: !!userId,
    staleTime: 1000 * 60 * 1,
  });
};
