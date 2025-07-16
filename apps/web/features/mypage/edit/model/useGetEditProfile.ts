import { useQuery } from '@tanstack/react-query';
import { getEditProfile } from '@/features/mypage/edit/model/getEditProfile';
import { UseGetEditProfileParams } from '@/features/mypage/edit/types';

export const useGetEditProfile = ({ userId }: UseGetEditProfileParams) => {
  return useQuery({
    queryKey: ['userEditProfile', userId],
    queryFn: () => getEditProfile({ userId }),
    enabled: !!userId,
    staleTime: 0,
  });
};
