'use server';

import { CreateSystemMessagePayload } from '../types';

export const createSystemMessage = async ({
  chatroomId,
  exhibitUserId,
  bidUserId,
  imgUrl,
  price,
  title,
}: CreateSystemMessagePayload): Promise<string | null> => {
  const baseURL = 'https://bider-git-test-bider-aac1a071.vercel.app';

  const response = await fetch(`${baseURL}/api/system-message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatroomId,
      exhibitUserId,
      bidUserId,
      imgUrl,
      price,
      title,
    }),
  });

  if (!response.ok) {
    console.error('시스템 메시지 생성 실패');
    return null;
  }

  const result = await response.json();
  return result.systemMessageId ?? null;
};
