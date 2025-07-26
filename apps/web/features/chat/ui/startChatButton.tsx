'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/model/authStore';
import { Children } from 'react';

export function StartChatButton({
  auctionId,
  exhibitUserId,
}: {
  auctionId: string;
  exhibitUserId: string;
}) {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);

  const handleStartChat = async () => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }
    const res = await fetch('/api/chat-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auction_id: auctionId,
        exhibit_user_id: exhibitUserId,
        bid_user_id: userId,
      }),
    });

    if (!res.ok) {
      alert('채팅방 생성에 실패했습니다.');
      return;
    }

    const { chatRoomId } = await res.json();
    if (chatRoomId) {
      router.push(`/chat/${chatRoomId}`);
    }
  };

  return <button type="button" onClick={handleStartChat}></button>;
}
