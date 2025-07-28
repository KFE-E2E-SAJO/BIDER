import { ProposalPriceParams } from '@/features/proposal/make/types';

const getProposalPrice = async (params: ProposalPriceParams) => {
  const { userId, shortId } = params;

  const res = await fetch(`/api/auction/${shortId}/proposal?userId=${userId}&shortId=${shortId}`);
  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.error || '데이터 로딩 실패');
  }

  return result.data;
};

export default getProposalPrice;
