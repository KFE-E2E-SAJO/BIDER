import ChatPageContent from '@/features/chat/room/ui/ChatPageContent';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';
import React from 'react';

const ChatPage = async ({ params }: { params: Promise<{ shortId: string }> }) => {
  const { shortId } = await params;
  return (
    <ReactQueryProvider>
      <ChatPageContent shortId={shortId} />
    </ReactQueryProvider>
  );
};

export default ChatPage;
