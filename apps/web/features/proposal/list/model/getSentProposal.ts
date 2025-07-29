import { ProposalListParams } from '@/features/proposal/list/types';
import { PROPOSAL_STATUS } from '@/shared/consts/proposalStatus';

const getSentProposal = async (params: ProposalListParams) => {
  const { filter, userId } = params;

  const res = await fetch(`/api/proposal/sent-proposal?userId=${userId}`);
  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.error || '데이터 로딩 실패');
  }

  const proposals = result.data as any[];

  const filtered = proposals.filter((proposal) => {
    switch (filter) {
      case 'pending':
        return proposal.proposal_status === PROPOSAL_STATUS.PENDING;
      case 'accepted':
        return proposal.proposal_status === PROPOSAL_STATUS.ACCEPTED;
      case 'ended':
        return proposal.proposal_status === PROPOSAL_STATUS.REJECTED;
      case 'all':
      default:
        return true;
    }
  });

  return filtered;
};

export default getSentProposal;
