'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useGetChatList } from '@/features/chat/model/useGetChatList';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { presenceState, selectedUserIdState, selectedUserIndexState } from '../lib/atoms';
import { supabase } from '@/shared/lib/supabaseClient';
import { useAuthStore } from '@/shared/model/authStore';
import { deleteChatRoom } from '@/features/chat/api/deleteChatRoom';

import React, { useState, useRef, useEffect } from 'react';
import { ChatroomWithInfoProps } from '../types';
import { Dialog } from '@repo/ui/components/Dialog/Dialog';
import { toast } from '@repo/ui/components/Toast/Sonner';

type ChatItemSwipeState = {
  [chatroom_id: string]: 'none' | 'left' | 'right'; // none: 기본, left: 좌로 스와이프(알림/신고), right: 우로 스와이프(차단/나가기)
};

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

const filters = [
  { label: '전체 채팅', value: 'all' },
  { label: '구매 채팅', value: 'buy' },
  { label: '판매 채팅', value: 'sell' },
  { label: '안 읽은 채팅', value: 'unread' },
];

function formatRelativeTime(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  // 오늘 같은 날이면
  if (
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()
  ) {
    if (diffHour > 0) return `${diffHour}시간`;
    if (diffMin > 0) return `${diffMin}분`;
    return '방금';
  }

  // 어제, 그제 등도 특별히 다르게 처리하려면 추가
  // 기본적으로는 "7월 22일" 이런식으로
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default function ChatList() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  const router = useRouter();
  const [selected, setSelected] = useState('all');
  //const [selectedUserId, setSelectedUserId] = useRecoilState(selectedUserIdState);
  //const [selectedUserIndex, setSelectedUserIndex] = useRecoilState(selectedUserIndexState);
  //const [presence, setPresence] = useRecoilState(presenceState);
  const DEFAULT_PROFILE_IMG = '/default-profile.png';
  const [swipeStates, setSwipeStates] = useState<ChatItemSwipeState>({});
  const dragStartX = useRef<number | null>(null);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  // 이벤트 핸들러 (좌우 swipe 감지)
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    const touch = e.touches[0];
    if (!touch) return;
    dragStartX.current = touch.clientX;
  };

  const handleTouchMove = (e: React.TouchEvent, id: string) => {
    if (dragStartX.current === null) return;
    const touch = e.touches[0]; // Touch | undefined

    if (!touch) return; // 확실하게 undefined 방지

    const diffX = touch.clientX - dragStartX.current;

    if (diffX > 50) {
      setSwipeStates((prev) => ({ ...prev, [id]: 'right' }));
    } else if (diffX < -50) {
      setSwipeStates((prev) => ({ ...prev, [id]: 'left' }));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, id: string) => {
    dragStartX.current = null;
    // 1초 후에 다시 none으로
    setTimeout(() => {
      setSwipeStates((prev) => ({ ...prev, [id]: 'none' }));
    }, 2000);
  };

  // 마우스(데스크탑)도 대응s
  const mouseDragStartX = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    mouseDragStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent, id: string) => {
    if (mouseDragStartX.current === null) return;
    const diffX = e.clientX - mouseDragStartX.current;

    if (diffX > 50) setSwipeStates((prev) => ({ ...prev, [id]: 'right' }));
    else if (diffX < -50) setSwipeStates((prev) => ({ ...prev, [id]: 'left' }));
  };

  const handleMouseUp = (e: React.MouseEvent, id: string) => {
    mouseDragStartX.current = null;
    setTimeout(() => setSwipeStates((prev) => ({ ...prev, [id]: 'none' })), 2000);
  };

  // 실제 채팅방 삭제 함수 (API 연동 등)
  const handleDeleteChatRoom = async (chatroomId: string) => {
    // 예시: API 호출 또는 mutation
    try {
      await deleteChatRoom(chatroomId);
      setOpenDialogId(null); // 모달 닫기
      queryClient.invalidateQueries({ queryKey: ['chat_room', userId] });
      if (window.location.pathname === `/chat/${chatroomId}`) {
        router.push('/chat');
        toast({ content: '삭제되었습니다.' });
      }
    } catch (err) {
      alert('채팅방 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('chatlist-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'message' }, () => {
        queryClient.invalidateQueries({ queryKey: ['chat_room', userId] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_room' }, () => {
        queryClient.invalidateQueries({ queryKey: ['chat_room', userId] });
      })
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  // 카테고리별 필터
  const { data: Rooms = [], isLoading, isError } = useGetChatList(userId || '');
  const filteredChats =
    Rooms && Array.isArray(Rooms)
      ? Rooms.filter((chat: any) => {
          if (selected === 'all') return true;
          if (selected === 'sell') return chat.buyer.user_id === userId;
          if (selected === 'buy') return chat.seller.user_id === userId;
          if (selected === 'unread') {
            return chat.unread > 0;
          }
          return true;
        })
      : [];

  const handleChatRoomClick = (chatroomId: string) => {
    router.push(`/chat/${chatroomId}`);
  };

  return (
    <div>
      <div className="flex h-screen w-screen flex-col bg-white">
        {/* 카테고리 버튼 */}
        <div className="flex gap-2 px-4 pb-2 pt-5">
          {filters.map((cat) => (
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
        {Array.isArray(Rooms) &&
          Rooms.map((room: any) => (
            <div
              key={room.chatroom_id}
              onClick={() => {
                router.push(`/chat/${room.chatroom_id}`);
              }}
            ></div>
          ))}
        {/* 채팅 목록 */}
        <div className="overflow-y-auto px-2">
          {isLoading && <div className="py-10 text-center text-sm text-gray-400">로딩 중...</div>}
          {isError && (
            <div className="py-10 text-center text-sm text-red-400">에러가 발생했습니다.</div>
          )}
          {!isLoading && !isError && filteredChats.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-400">채팅이 없습니다.</div>
          )}
          {!isLoading &&
            !isError &&
            filteredChats.map((chat: any) => {
              console.log('chat:', chat);
              const swipeState = swipeStates[chat.chatroom_id] || 'none';
              const isSeller = chat.seller?.user_id === userId;
              const isBuyer = chat.buyer?.user_id === userId;

              const myProfile = isSeller ? chat.seller : isBuyer ? chat.buyer : null; // 혹시 seller/buyer가 아닌 경우는 null
              const otherProfile = isSeller ? chat.buyer : isBuyer ? chat.seller : null;

              const unread = Array.isArray(chat.messages)
                ? chat.messages.filter((msg: any) => !msg.is_read && msg.sender_id !== userId)
                    .length
                : 0;

              const latestMessage = chat.latestMessage;
              const isMyMessage = latestMessage?.sender_id === userId;

              // 내가 보낸 메시지면 항상 회색
              // 상대가 보냈고 아직 is_read가 false면 검정(안읽음), 아니면 회색(읽음)
              let previewTextClass = 'text-gray-400';
              if (!isMyMessage) {
                previewTextClass =
                  latestMessage?.is_read === false ? 'text-black' : 'text-gray-400';
              }

              return (
                <div
                  key={chat.chatroom_id}
                  className="relative h-[80px] select-none overflow-hidden border-b border-neutral-100 last:border-b-0"
                  onClick={() => handleChatRoomClick(chat.chatroom_id)}
                  // 모바일/터치
                  onTouchStart={(e) => handleTouchStart(e, chat.chatroom_id)}
                  onTouchMove={(e) => handleTouchMove(e, chat.chatroom_id)}
                  onTouchEnd={(e) => handleTouchEnd(e, chat.chatroom_id)}
                  // 데스크탑
                  onMouseDown={(e) => handleMouseDown(e, chat.chatroom_id)}
                  onMouseMove={(e) => handleMouseMove(e, chat.chatroom_id)}
                  onMouseUp={(e) => handleMouseUp(e, chat.chatroom_id)}
                >
                  {/* 오른쪽 슬라이드(알림끄기/신고하기) - swipeState === 'right' */}
                  <div
                    className={`absolute inset-0 flex h-full w-full transition-all duration-300 ${swipeState === 'right' ? 'z-0' : '-z-10'} `}
                  >
                    <button className="h-full w-1/4 bg-green-300 text-base font-semibold text-white">
                      알림끄기
                    </button>
                    <button className="h-full w-1/4 bg-gray-500 text-base font-semibold text-white">
                      신고하기
                    </button>
                  </div>
                  {/* 왼쪽 슬라이드(차단하기/나가기) - swipeState === 'left' */}
                  <div
                    className={`absolute inset-0 flex h-full w-full justify-end transition-all duration-300 ${swipeState === 'left' ? 'z-0' : '-z-10'} `}
                  >
                    <button className="h-full w-1/4 bg-pink-200 text-base font-semibold text-red-700">
                      차단하기
                    </button>
                    <button
                      className="h-full w-1/4 bg-pink-400 text-base font-semibold text-white"
                      onClick={(e) => {
                        e.stopPropagation(); // 리스트 클릭 방지
                        setOpenDialogId(chat.chatroom_id);
                      }}
                    >
                      나가기
                    </button>
                  </div>
                  {/* 채팅방 컨텐츠 (평소엔 translateX 0, 슬라이드시만 이동) */}
                  <div
                    className={`relative z-10 flex h-full items-center gap-3 bg-white px-2 transition-transform duration-300 ${
                      swipeState === 'left'
                        ? '-translate-x-1/2'
                        : swipeState === 'right'
                          ? 'translate-x-1/2'
                          : ''
                    } `}
                    onClick={() => handleChatRoomClick(chat.chatroom_id)}
                  >
                    {/* 상품 이미지 */}
                    <img
                      src={chat.product_image_url}
                      alt="Product"
                      className="h-11 w-11 rounded-md object-cover"
                    />
                    {/* 채팅방 주요 정보 (flex-1로 좌측) */}
                    <div className="min-w-0 flex-1">
                      {/* 프로필+닉네임+뱃지 */}
                      <div className="flex items-center gap-1">
                        <img
                          src={otherProfile?.profile_img || DEFAULT_PROFILE_IMG}
                          alt="프로필"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PROFILE_IMG;
                          }}
                          className="h-5 w-5 rounded-full border border-gray-200 object-cover"
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          {otherProfile?.nickname || '알수없음'}
                        </span>
                        {chat.winning_bid_user_id === userId &&
                          chat.winning_bid_user_id !== null && (
                            <span className="ml-1 bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-500">
                              낙찰
                            </span>
                          )}
                      </div>
                      {/* 메시지 미리보기+시간 */}
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`block w-44 truncate text-xs ${previewTextClass}`}>
                          {chat.latestMessage?.content || '메시지가 없습니다.'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(chat.created_at)}
                        </span>
                      </div>
                    </div>
                    {/* 맨 오른쪽: 안읽은 메시지 > 아이콘 */}
                    {chat.unread > 0 && (
                      <span className="ml-2 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-green-500 px-2 text-xs font-bold text-white">
                        {chat.unread}
                      </span>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="16"
                      viewBox="0 0 10 16"
                      fill="none"
                    >
                      <path
                        d="M1.5 15L8.5 8L1.5 1"
                        stroke="#B4B4B4"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {/* ---- Dialog 모달: 나가기 ---- */}
                  <Dialog
                    open={openDialogId === chat.chatroom_id}
                    onOpenChange={(open) => {
                      if (!open) setOpenDialogId(null);
                    }}
                    title={undefined}
                    description={undefined}
                    showCloseButton={false}
                    className="rounded-t-3xl !bg-white !p-0 !pb-5 !shadow-xl"
                  >
                    <div className="flex flex-col items-center px-6 py-7">
                      <div className="mb-6 text-center text-base text-gray-700">
                        대화 내용이 모두 삭제됩니다.
                        <br />
                        계속하시겠습니까?
                      </div>
                      <div className="flex w-full items-center gap-2 border-t border-neutral-100">
                        <button
                          onClick={() => setOpenDialogId(null)}
                          className="bg-neutral-0 flex-1 rounded-xl border-r border-neutral-100 py-3 font-semibold text-gray-500"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleDeleteChatRoom(chat.chatroom_id)}
                          className="bg-neutral-0 flex-1 rounded-xl py-3 font-semibold text-pink-500"
                        >
                          삭제하기
                        </button>
                      </div>
                    </div>
                  </Dialog>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
