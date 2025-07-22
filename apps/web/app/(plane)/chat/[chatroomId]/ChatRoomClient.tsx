'use client';

import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import ChatRoom from '@/features/chat/ui/ChatRoom';

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

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ChatRoom roomId={roomId} />
      </RecoilRoot>
    </QueryClientProvider>
  );
}
