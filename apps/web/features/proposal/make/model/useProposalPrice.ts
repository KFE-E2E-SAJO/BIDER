import { useQuery } from '@tanstack/react-query';
import getProposalPrice from '@/features/proposal/make/model/getProposalPrice';
import { ProposalPriceParams } from '@/features/proposal/make/types';

export const useProposalPrice = (params: ProposalPriceParams) => {
  return useQuery({
    queryKey: ['proposalPrice', params.userId, params.shortId],
    queryFn: () => getProposalPrice(params),
    enabled: !!params.userId && !!params.shortId,
    staleTime: 1000 * 60 * 1,
  });
};
