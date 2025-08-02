import { useQuery } from '@tanstack/react-query';
import getTargetProduct from '@/features/proposal/make/model/getTargetProduct';
import { ProposalPriceParams } from '@/features/proposal/make/types';

export const useTargetProduct = (params: ProposalPriceParams) => {
  return useQuery({
    queryKey: ['targetProduct', params.userId, params.shortId],
    queryFn: () => getTargetProduct(params),
    enabled: !!params.userId && !!params.shortId,
    staleTime: 1000 * 60 * 1,
  });
};
