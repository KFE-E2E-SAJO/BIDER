import { useQuery } from '@tanstack/react-query';
import getProfile from '@/features/mypage/model/getProfile';

interface useGetProfileParams {
  userId: string;
}

export const useGetProfile = ({ userId }: useGetProfileParams) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getProfile({ userId }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 1,
  });
};
