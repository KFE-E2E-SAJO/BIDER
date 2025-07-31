import React from 'react';
import ChatInputBar from './ChatInputBar';
import AuctionInfo from './AuctionInfo';
import MessageList from './MessageList';

const ChatPageContent = () => {
  return (
    <div className="flex h-screen flex-col">
      {/* 경매 상품 설명 */}
      <AuctionInfo />

      {/* 채팅 내역 */}
      <div className="p-box mb-[77px] mt-[65px] flex-1 overflow-y-auto">
        <MessageList />
      </div>

      {/* 채팅입력칸 */}
      <ChatInputBar />
    </div>
  );
};

export default ChatPageContent;
