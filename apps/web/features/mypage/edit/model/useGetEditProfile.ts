import { useQuery } from '@tanstack/react-query';
import { getEditProfile } from '@/features/mypage/edit/lib/getEditProfile';

interface UseGetEditProfileParams {
  userId: string;
}

export const useGetEditProfile = ({ userId }: UseGetEditProfileParams) => {
  return useQuery({
    queryKey: ['userEditProfile', userId],
    queryFn: () => getEditProfile({ userId }),
    enabled: !!userId,
    staleTime: 0,
  });
};
