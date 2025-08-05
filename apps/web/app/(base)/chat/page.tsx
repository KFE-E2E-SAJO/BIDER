import ChatListPageContent from '@/features/chat/list/ui/ChatListPageContent';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';
import React from 'react';

const ChatListPage = () => {
  return (
    <ReactQueryProvider>
      <ChatListPageContent />
    </ReactQueryProvider>
  );
};

export default ChatListPage;
