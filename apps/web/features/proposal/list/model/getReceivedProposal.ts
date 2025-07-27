import { ProposalListParams } from '@/features/proposal/list/types';
import { PROPOSAL_STATUS } from '@/shared/consts/proposalStatus';

const getReceivedProposal = async (params: ProposalListParams) => {
  const { filter, userId } = params;

  const res = await fetch(`/api/proposal/received-proposal?userId=${userId}`);
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
        return [PROPOSAL_STATUS.REJECTED, PROPOSAL_STATUS.EXPIRED].includes(
          proposal.proposal_status
        );
      case 'all':
      default:
        return true;
    }
  });

  return filtered;
};

export default getReceivedProposal;
