import React from 'react';
import ChatInputBar from './ChatInputBar';
import AuctionInfo from './AuctionInfo';
import MessageList from './MessageList';

const ChatPageContent = () => {
  return (
    <div className="flex h-[100dvh-67px] flex-col">
      {/* 경매 상품 설명 */}
      <AuctionInfo />

      {/* 채팅 내역 */}
      <div className="p-box min-h-0 flex-1">
        <MessageList />
      </div>

      {/* 채팅입력칸 */}
      <ChatInputBar />
    </div>
  );
};

export default ChatPageContent;
