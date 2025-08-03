'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import ChatRoom from '@/features/chat/ui/ChatRoom';
import { useAuthStore } from '@/shared/model/authStore';
import { useGetChatRoom } from '@/features/chat/model/useGetChatRoom';
import { string } from 'zod';

export default function ChatRoomClient({ roomId }: { roomId: string }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const userId = useAuthStore((state) => state.user?.id);

  return (
    <QueryClientProvider client={queryClient}>
      <ChatRoomWithData roomId={roomId} userId={userId!} />
    </QueryClientProvider>
  );
}

function ChatRoomWithData({ roomId, userId }: { roomId: string; userId: string }) {
  const { data, isLoading, error } = useGetChatRoom({ userId, roomId });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {String((error as any)?.message)}</div>;
  if (!data) return <div>데이터 없음</div>;

  // data가 객체라면 그대로 전달
  // 혹은 배열로 오는 경우는 [0]만 전달 (백엔드 구조에 따라)
  const apiData = Array.isArray(data) ? data[0] : data;

  return <ChatRoom roomId={roomId} apiData={apiData as any} />;
}
