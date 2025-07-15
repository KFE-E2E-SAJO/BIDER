interface GetEditProfileParams {
  userId: string;
}

export const getEditProfile = async ({ userId }: GetEditProfileParams) => {
  const res = await fetch(`/api/mypage?userId=${userId}`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || '프로필 정보를 불러오는 데 실패했습니다.');
  }

  const result = await res.json();
  return result.data;
};
