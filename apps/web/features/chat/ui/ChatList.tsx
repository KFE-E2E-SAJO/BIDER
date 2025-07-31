import React from 'react';
import { ChatListProps } from '../types';
import Image from 'next/image';
import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { ChevronRight } from 'lucide-react';
import ChatItem from './ChatItem';

const ChatList = ({ filter, data }: ChatListProps) => {
  return (
    <div className="p-box mt-[21px]">
      <ChatItem />
    </div>
  );
};

export default ChatList;
