interface SetUserInfoProps {
  userId: string;
  nickname: string;
  profileImg: string | null;
}

export const setUserInfo = async ({ userId, nickname, profileImg }: SetUserInfoProps) => {
  const res = await fetch('/api/mypage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, nickname, profileImg }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '유저 정보 업데이트 실패');
  }
};
