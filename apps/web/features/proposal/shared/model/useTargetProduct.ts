import { useQuery } from '@tanstack/react-query';
import getTargetProduct from '@/features/proposal/shared/model/getTargetProduct';
import { TargetProductParams } from '@/features/proposal/shared/types';

export const useTargetProduct = (params: TargetProductParams) => {
  return useQuery({
    queryKey: ['targetProduct', params.userId, params.shortId],
    queryFn: () => getTargetProduct(params),
    enabled: !!params.userId && !!params.shortId,
    staleTime: 1000 * 60 * 1,
  });
};
