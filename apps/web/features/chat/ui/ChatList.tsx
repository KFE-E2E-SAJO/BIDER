'use client';

import { useQuery } from '@tanstack/react-query';
import { useGetChatList } from '@/features/chat/model/useGetChatList';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { presenceState, selectedUserIdState, selectedUserIndexState } from '../lib/atoms';
import { supabase } from '@/shared/lib/supabaseClient';
import { useAuthStore } from '@/shared/model/authStore';

import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import { ChatroomWithInfoProps } from '../types';

// Define the Room type
type Room = {
  roomId: string;
  name: string;
};

// Temporary function to fetch rooms - replace with actual implementation
const Rooms = async (): Promise<Room[]> => {
  // Replace this with your actual API call
  return [];
};

const categories = [
  { label: '전체 채팅', value: 'all' },
  { label: '구매 채팅', value: 'buy' },
  { label: '판매 채팅', value: 'sell' },
  { label: '안 읽은 채팅', value: 'unread' },
];

export default function ChatList() {
  const userId = useAuthStore((state) => state.user?.id);
  const router = useRouter();
  const [selected, setSelected] = useState('all');
  const [selectedUserId, setSelectedUserId] = useRecoilState(selectedUserIdState);
  const [selectedUserIndex, setSelectedUserIndex] = useRecoilState(selectedUserIndexState);
  const [presence, setPresence] = useRecoilState(presenceState);
  const DEFAULT_PROFILE_IMG = '/default-profile.png';

  useEffect(() => {
    const changes = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_room',
        },
        (payload) => console.log(payload)
      )
      .subscribe();
  }, []);

  //   const channel = anonSupabase.channel('online_users', {
  //     config: {
  //       presence: {
  //         key: userId,
  //       },
  //     },
  //   });

  //   channel.on('presence', { event: 'sync' }, () => {
  //     const newState = channel.presenceState();
  //     const newStateObj = JSON.parse(JSON.stringify(newState));
  //     setPresence(newStateObj);
  //   });

  //   channel.subscribe(async (status: string) => {
  //     if (status !== 'SUBSCRIBED') {
  //       return;
  //     }

  //     const newPresenceStatus: unknown = await channel.track({
  //       onlineAt: new Date().toISOString(),
  //     });
  //   });

  //   return () => {
  //     channel.unsubscribe();
  //   };
  // }, []);

  // 카테고리별 필터
  const { data: Rooms = [], isLoading, isError } = useGetChatList(userId || '');
  console.log('Rooms:', Rooms);
  const filteredChats =
    Rooms && Array.isArray(Rooms)
      ? Rooms.filter((chat: any) => {
          if (selected === 'all') return true;
          if (selected === 'sell') return chat.exhibit_user_id === userId;
          if (selected === 'buy') return chat.bid_user_id === userId;
          if (selected === 'unread') {
            return (
              chat.messages &&
              chat.messages.some((msg: any) => !msg.is_read && msg.sender_id !== userId)
            );
          }
          return true;
        })
      : [];

  const handleChatRoomClick = (chatroomId: string) => {
    router.push(`/chat/${chatroomId}`);
  };

  return (
    <div>
      {Array.isArray(Rooms) &&
        Rooms.map((room: any) => (
          <div
            key={room.chatroom_id}
            onClick={() => {
              router.push(`/chat/${room.chatroom_id}`);
            }}
          ></div>
        ))}
      <div className="flex h-full w-full flex-col bg-white">
        {/* 카테고리 버튼 */}
        <div className="flex gap-2 px-4 pb-2 pt-5">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelected(cat.value)}
              className={`rounded-full border px-3 py-1 transition-colors ${
                selected === cat.value
                  ? 'border-black bg-black font-semibold text-white'
                  : 'border-gray-200 bg-white text-gray-500'
              } text-sm`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 채팅 목록 */}
        <div className="flex-1 overflow-y-auto px-2">
          {isLoading && <div className="py-10 text-center text-sm text-gray-400">로딩 중...</div>}
          {isError && (
            <div className="py-10 text-center text-sm text-red-400">에러가 발생했습니다.</div>
          )}
          {!isLoading && !isError && filteredChats.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-400">채팅이 없습니다.</div>
          )}
          {!isLoading &&
            !isError &&
            filteredChats.map((chat: any) => (
              <div
                key={chat.chatroom_id}
                className="flex h-[80px] cursor-pointer items-center gap-3 border-b px-2 last:border-b-0 hover:bg-gray-50"
                onClick={() => handleChatRoomClick(chat.chatroom_id)}
              >
                <img
                  key={chat.chatroom_id}
                  src={chat.product_image_url}
                  alt="Product Image"
                  className="h-11 w-11 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                      {chat.nickname || '알수없음'}
                      <img
                        src={chat.profile_img || DEFAULT_PROFILE_IMG}
                        alt="프로필"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_PROFILE_IMG;
                        }}
                        className="ml-1 h-5 w-5 rounded-full border border-gray-200 object-cover"
                      />
                    </span>
                    {chat.unread > 0 && (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-500">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      key={chat.chatroom_id}
                      className="block w-44 truncate text-xs text-gray-500"
                    >
                      {chat.messages &&
                        chat.messages.some((msg: any) => msg.content || '메시지가 없습니다.')}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">
                      {new Date(chat.updated_at).toLocaleString('ko-KR', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <span className="ml-2 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                  {/* {data} */}
                </span>

                <svg
                  className="h-4 w-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
