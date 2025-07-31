'use client';

import React from 'react';
import { ChatListProps } from '../types';
import ChatItem from './ChatItem';
import Link from 'next/link';
import { useChatStore } from '../../room/model/chatStore';

const ChatList = ({ filter, data }: ChatListProps) => {
  const setNickname = useChatStore((s) => s.setNickname);

  return (
    <div className="p-box mt-[21px]">
      <Link href={'/chat/asdv'}>
        <ChatItem onClick={() => setNickname('입찰매니아')} />
      </Link>
    </div>
  );
};

export default ChatList;
