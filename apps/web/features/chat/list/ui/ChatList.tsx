import React from 'react';
import { ChatListProps } from '../types';
import ChatItem from './ChatItem';
import Link from 'next/link';
import { useChatStore } from '../../room/model/chatStore';
import { useAuthStore } from '@/shared/model/authStore';
import { encodeUUID } from '@/shared/lib/shortUuid';

const ChatList = ({ filter, data }: ChatListProps) => {
  const setNickname = useChatStore((s) => s.setNickname);
  const userId = useAuthStore((state) => state.user?.id) as string;

  let filteredData;
  switch (filter) {
    case 'buy':
      filteredData = data.filter((item) => item.bid_user_id === userId);
      break;
    case 'sell':
      filteredData = data.filter((item) => item.exhibit_user_id === userId);
      break;
    case 'unread':
      filteredData = data.filter((item) => item.last_message?.is_read === false);
      break;
    default:
      filteredData = data;
      break;
  }

  return (
    <div className="p-box mt-[21px]">
      {filteredData?.map((chat, index) => (
        <div key={chat.chatroom_id}>
          {index !== 0 && <div className="my-[17px] h-[1px] w-full bg-neutral-100"></div>}
          <Link href={`/chat/${encodeUUID(chat.chatroom_id)}`}>
            <ChatItem onClick={() => setNickname(chat.your_profile.nickname)} data={chat} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
