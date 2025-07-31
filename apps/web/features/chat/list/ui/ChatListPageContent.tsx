import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import React from 'react';
import ChatList from './ChatList';

const ChatListPageContent = () => {
  const items = [
    { value: 'all', label: '전체 채팅', content: <ChatList filter="all" data={[]} /> },
    { value: 'buy', label: '구매 채팅', content: <ChatList filter="buy" data={[]} /> },
    { value: 'sell', label: '판매 채팅', content: <ChatList filter="sell" data={[]} /> },
    { value: 'unread', label: '안 읽은 채팅', content: <ChatList filter="unread" data={[]} /> },
  ];
  return (
    <div>
      <Tabs className="mt-[11px]" defaultValue="all" items={items} />
    </div>
  );
};

export default ChatListPageContent;
