import { useQuery } from '@tanstack/react-query';
import getProfile from '@/features/mypage/model/getProfile';
import { useGetProfileParams } from '@/features/mypage/types';

export const useGetProfile = ({ userId }: useGetProfileParams) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getProfile({ userId }),
    enabled: !!userId,
    staleTime: 0,
  });
};
