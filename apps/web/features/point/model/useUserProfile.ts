import { useQuery } from '@tanstack/react-query';
import { getUserPoint } from '../api/getUserPoint';

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['Userpoint', userId],
    queryFn: () => getUserPoint(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 1,
  });
};
