import { useQuery } from '@tanstack/react-query';
import { ProposalDetailParams } from '@/features/proposal/list/types';
import getProposalDetail from '@/features/proposal/list/model/getProposalDetail';

export const useProposalDetail = (params: ProposalDetailParams) => {
  return useQuery({
    queryKey: ['proposalDetail', params.userId, params.proposalId],
    queryFn: () => getProposalDetail(params),
    enabled: !!params.userId && !!params.proposalId,
    staleTime: 1000 * 60 * 1,
  });
};
