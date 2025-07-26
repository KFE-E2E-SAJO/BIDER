import { TargetProductParams } from '@/features/proposal/shared/types';

const getTargetProduct = async (params: TargetProductParams) => {
  const { userId, shortId } = params;

  const res = await fetch(`/api/proposal/find-auction?userId=${userId}&shortId=${shortId}`);
  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.error || '데이터 로딩 실패');
  }

  return result.data;
};

export default getTargetProduct;
