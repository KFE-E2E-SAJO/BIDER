import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/features/mypage/lib/getProfile';

interface UseGetProfileParams {
  userId: string;
}

export const useGetProfile = ({ userId }: UseGetProfileParams) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getProfile({ userId }),
    enabled: !!userId,
    staleTime: 0,
  });
};
