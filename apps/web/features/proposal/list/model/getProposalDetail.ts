import { ProposalDetailParams } from '@/features/proposal/list/types';
import getUserId from '@/shared/lib/getUserId';

const getProposalDetail = async (params: ProposalDetailParams) => {
  const { proposalId } = params;
  const userId = await getUserId();
  const res = await fetch(
    `/api/proposal/received-proposal/proposal-detail?userId=${userId}&proposalId=${proposalId}`
  );
  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.error || '데이터 로딩 실패');
  }

  return result.data;
};

export default getProposalDetail;
