'use client';

import { Tabs } from '@repo/ui/components/Tabs/Tabs';
import React from 'react';
import ChatList from './ChatList';
import { useChatList } from '../model/useChatList';
import Loading from '@/shared/ui/Loading/Loading';

const ChatListPageContent = () => {
  const { data, isLoading, error } = useChatList();

  if (isLoading) return <Loading />;
  if (error) return <p>오류: {(error as Error).message}</p>;
  if (!data) return <p>채팅 정보를 찾을 수 없습니다.</p>;

  console.log(data);

  const items = [
    { value: 'all', label: '전체 채팅', content: <ChatList filter="all" data={data ?? []} /> },
    { value: 'buy', label: '구매 채팅', content: <ChatList filter="buy" data={data ?? []} /> },
    { value: 'sell', label: '판매 채팅', content: <ChatList filter="sell" data={data ?? []} /> },
    {
      value: 'unread',
      label: '안 읽은 채팅',
      content: <ChatList filter="unread" data={data ?? []} />,
    },
  ];
  return (
    <div>
      <Tabs className="mt-[11px]" defaultValue="all" items={items} />
    </div>
  );
};

export default ChatListPageContent;
