import { ProfileParams } from '@/features/mypage/types';

const getProfile = async (params: ProfileParams) => {
  const { userId } = params;

  const res = await fetch(`/api/mypage?userId=${userId}`);
  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.error || '데이터 로딩 실패');
  }

  return result.data;
};

export default getProfile;
