import { useQuery } from '@tanstack/react-query';
import { ProposalItem, ProposalListParams } from '@/features/proposal/list/types';
import getReceivedProposal from '@/features/proposal/list/model/getReceivedProposal';

export const useReceivedProposal = (params: ProposalListParams) => {
  return useQuery<ProposalItem[]>({
    queryKey: ['receivedProposalList', params.userId, params.filter],
    queryFn: () => getReceivedProposal(params),
    enabled: !!params.userId,
    staleTime: 1000 * 10,
  });
};
