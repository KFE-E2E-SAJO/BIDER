'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../../../app/model/chatActions';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react';

// Define the Room type
type Room = {
  roomId: string;
  name: string;
};

// Temporary function to fetch rooms - replace with actual implementation
const fetchRooms = async (): Promise<Room[]> => {
  // Replace this with your actual API call
  return [];
};

const categories = [
  { label: '전체 채팅', value: 'all' },
  { label: '구매 채팅', value: 'buy' },
  { label: '판매 채팅', value: 'sell' },
  { label: '안 읽은 채팅', value: 'unread' },
];

/*
const chats = [
  {
    id: 1,
    user: '입찰매니아',
    message: '구매 가능한가요?',
    time: '1시간',
    unread: 1,
    label: null,
    date: null,
    profile: 'https://randomuser.me/api/portraits/men/32.jpg',
    type: 'buy',
  },
  {
    id: 2,
    user: '입찰매니아',
    message: '넵 좋은 하루 되세요~!!!',
    time: '6월 3일',
    unread: 0,
    label: null,
    date: '6월 3일',
    profile: 'https://randomuser.me/api/portraits/men/32.jpg',
    type: 'buy',
  },
  {
    id: 3,
    user: '입찰매니아',
    message: '넵 좋은 하루 되세요~!!!',
    time: '6월 3일',
    unread: 0,
    label: '낙찰',
    date: '6월 3일',
    profile: 'https://randomuser.me/api/portraits/men/32.jpg',
    type: 'sell',
  },
  {
    id: 4,
    user: '입찰매니아',
    message: '넵 좋은 하루 되세요~!!!',
    time: '6월 3일',
    unread: 2,
    label: null,
    date: '6월 3일',
    profile: 'https://randomuser.me/api/portraits/men/32.jpg',
    type: 'sell',
  },
  {
    id: 5,
    user: '입찰매니아',
    message: '넵 좋은 하루 되세요~!!!',
    time: '6월 3일',
    unread: 0,
    label: null,
    date: '6월 3일',
    profile: 'https://randomuser.me/api/portraits/men/32.jpg',
    type: 'buy',
  },
];
*/

// 유저 리스트가 아래와 같이 내려온다고 가정
// type User = {
//   chatroom_id: uuid;
//   auction_id: uuid;
//   exhibit_user_id: uuid -> nickname, profile_img;
//   message: string;
//   updated_at: string;
//   unread: number;
//   badge: string;
//   type: 'buy' | 'sell';
// };

export default function ChatList({ loggedInUser }: { loggedInUser: { id: string } }) {
  const router = useRouter();
  const [selected, setSelected] = useState('all');

  // 실제 데이터 패치 (React Query)
  console.log('ChatList 렌더링됨!');
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['chat_room'],
    queryFn: async () => {
      console.log('queryFn 실행!');
      const allUsers = await getAllUsers();
      console.log(allUsers);
      return allUsers.filter((user) => user.id !== loggedInUser.id);
    },
  });

  const totalUnreadCount = users.reduce((sum, chat) => sum + (chat.unread || 0), 0);

  const { data: rooms = [] } = useQuery({
    queryKey: ['chat_rooms'],
    queryFn: fetchRooms, // 실제 데이터 불러오는 함수
  });
  // 카테고리별 필터
  const filteredChats = users.filter((chat: any) => {
    if (selected === 'all') return true;
    if (selected === 'buy') return chat.type === 'buy';
    if (selected === 'sell') return chat.type === 'sell';
    if (selected === 'unread') return chat.unread > 0;
    return true;
  });

  const handleChatRoomClick = (chatroomId: string) => {
    router.push(`/chat/${chatroomId}`);
  };

  return (
    <div>
      {rooms.map((room) => (
        <div key={room.roomId} onClick={() => router.push(`/chat/${room.roomId}`)}>
          {room.name}
        </div>
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
                key={chat.id}
                className="flex h-20 cursor-pointer items-center gap-3 border-b px-2 last:border-b-0 hover:bg-gray-50"
                style={{ minHeight: 80 }}
                onClick={() => handleChatRoomClick(chat.id)}
              >
                <img
                  src={chat.profile_img || 'https://via.placeholder.com/44'}
                  alt="유저"
                  className="h-11 w-11 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                      {chat.nickname || '알수없음'}
                      <img
                        src={chat.profile_img || 'https://via.placeholder.com/20'}
                        alt="프로필"
                        className="ml-1 h-5 w-5 rounded-full border border-gray-200 object-cover"
                      />
                    </span>
                    {chat.badge && (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-500">
                        {chat.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="block w-44 truncate text-xs text-gray-500">
                      {chat.message}
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
                {totalUnreadCount > 0 ? (
                  <span className="ml-2 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                    {totalUnreadCount}
                  </span>
                ) : (
                  <svg
                    className="h-4 w-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
