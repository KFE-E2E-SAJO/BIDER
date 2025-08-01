import React from 'react';
import ChatInputBar from '@/features/chat/room/ui/ChatInputBar';
import AuctionInfo from '@/features/chat/room/ui//AuctionInfo';
import MessageList from '@/features/chat/room/ui//MessageList';

const ChatPageContent = () => {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      {/* 경매 상품 설명 */}
      <AuctionInfo />

      {/* 채팅 내역 */}
      <MessageList />

      {/* 채팅입력칸 */}
      <ChatInputBar />
    </div>
  );
};

export default ChatPageContent;
