import React from 'react';
import ChatInputBar from './ChatInputBar';
import AuctionInfo from './AuctionInfo';
import MessageList from './MessageList';

const ChatPageContent = () => {
  return (
    <div className="flex flex-col overflow-hidden">
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
