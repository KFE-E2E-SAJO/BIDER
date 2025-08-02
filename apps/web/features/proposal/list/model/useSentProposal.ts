import { useQuery } from '@tanstack/react-query';
import { ProposalItem, ProposalListParams } from '@/features/proposal/list/types';
import getSentProposal from '@/features/proposal/list/model/getSentProposal';

export const useSentProposal = (params: ProposalListParams) => {
  return useQuery<ProposalItem[]>({
    queryKey: ['sentProposalList', params.userId, params.filter],
    queryFn: () => getSentProposal(params),
    enabled: !!params.userId,
    staleTime: 0,
  });
};
