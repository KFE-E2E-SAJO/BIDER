'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Message } from './Message';
import { useRecoilValue } from 'recoil';
import { presenceState, selectedUserIdState, selectedUserIndexState } from '../lib/atoms';
import { useAuthStore } from '@/shared/model/authStore';
import { anonSupabase } from '@/shared/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useGetChatRoom } from '../model/useGetChatRoom';
import { useSendMessage } from '../model/useSendMessage';

function formatKoreanTime(dateString: string | Date | undefined) {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return '';
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours < 12 ? '오전' : '오후';
  hours = hours % 12 || 12;
  return `${ampm} ${hours}:${minutes.toString().padStart(2, '0')}`;
}

export default function ChatRoom({ roomId }: { roomId: string }) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id) as string;
  const [input, setInput] = useState('');
  const [plusMode, setPlusMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const plusItems = ['location', 'photo', 'file', 'contact'];
  const selectedUserId = useRecoilValue(selectedUserIdState);
  const selectedUserIndex = useRecoilValue(selectedUserIndexState);
  const presence = useRecoilValue(presenceState);
  const router = useRouter();
  const sendMessageMutation = useSendMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    data: chatRoomData,
    isLoading,
    isError,
    error,
  } = useGetChatRoom({ userId, chatroomId: roomId });

  const roomData = Array.isArray(chatRoomData) ? chatRoomData[0] : chatRoomData;
  // ⬇️ 여기에 바로 추가!
  const isSeller = (roomData as any)?.seller?.user_id === userId;
  const isBuyer = (roomData as any)?.buyer?.user_id === userId;

  const myProfile = isSeller
    ? (roomData as any)?.seller
    : isBuyer
      ? (roomData as any)?.buyer
      : null;
  const otherProfile = isSeller
    ? (roomData as any)?.buyer
    : isBuyer
      ? (roomData as any)?.seller
      : null;

  const messages = (roomData as any)?.messages || [];
  console.log('otherProfile: ', otherProfile);

  // 1. 날짜 문자열로 변환 함수 (ex: 2025년 7월 21일)
  function getDateStr(date: string) {
    const d = new Date(date);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  }

  // 2. 날짜별로 그룹핑 (배열 -> [{date, messages: [...]}, ...])
  function groupByDate(messages: any[]) {
    return messages.reduce((groups: any[], msg) => {
      const dateStr = getDateStr(msg.created_at || msg.time);
      const lastGroup = groups[groups.length - 1];
      if (!lastGroup || lastGroup.date !== dateStr) {
        groups.push({ date: dateStr, messages: [msg] });
      } else {
        lastGroup.messages.push(msg);
      }
      return groups;
    }, []);
  }

  // ✅ 수정된 useEffect - messages 변화에 따른 스크롤
  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // 약간의 지연을 주어 DOM 업데이트 완료 후 스크롤
    }
  }, [messages, messages.length]); // messages 배열 변화 감지

  // ✅ 새 메시지 전송 후 스크롤
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!userId || !roomId || !input.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({
        content: input.trim(),
        userId,
        chatroomId: roomId,
      });

      setInput('');

      // 메시지 전송 후 스크롤
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (error) {
      console.error('메시지 전송 에러:', error);
    }
  };
  //+ 버튼 클릭 시
  const handlePlusClick = () => {
    setPlusMode(true);
  };

  // X 버튼 클릭 시
  const handleCloseClick = () => {
    setPlusMode(false);
    // 입력창에 포커스
    inputRef.current?.focus();
  };

  useEffect(() => {
    const channel = anonSupabase
      .channel('message_postgres_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message',
        },
        (payload) => {
          if (payload.eventType === 'INSERT' && !payload.errors) {
            queryClient.invalidateQueries({
              queryKey: ['messages', roomId],
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const grouped = groupByDate(messages);
  console.log('roomData:', roomData);
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-white">
      <div className="flex flex-col gap-2 border-b border-t border-neutral-100 px-4 pb-2 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="mr-1" onClick={() => router.back()}>
              <svg
                width={24}
                height={24}
                fill="none"
                stroke="#222"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-base font-semibold">{otherProfile?.nickname || '사용자'}</span>
          </div>

          <button>
            <svg
              width={22}
              height={22}
              fill="none"
              stroke="#000"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
              <circle cx="5" cy="12" r="1.5" />
            </svg>
          </button>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs">
          <img
            src={(roomData as any)?.product_image_url || '/default-product.png'}
            alt="Product Image"
            className="h-9 w-9 rounded-md object-cover"
          />
          <div className="flex min-w-0 flex-col justify-center">
            <div className="truncate text-[13px] font-medium">{(roomData as any)?.title}</div>
            <div className="text-[15px] font-bold">
              {((roomData as any)?.min_price || 0).toLocaleString()}원
            </div>
          </div>
          <span className="ml-auto rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
            경매 종료
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 py-4">
        <img
          src={otherProfile?.profile_img || '/default-profile.png'} // 곰돌이 이미지
          className="h-16 w-16 rounded-full"
          alt="프로필"
        />

        <span className="mt-2 text-base font-bold text-gray-900">
          {otherProfile?.nickname || '사용자'}
        </span>
        <span className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <svg width={14} height={14} fill="none" viewBox="0 0 24 24" className="mr-0.5 inline">
            <path
              fill="#4884FF"
              d="M12 2l2.39 7.26H22l-6.19 4.51 2.36 7.23L12 16.01l-6.17 4.49L8.19 13.8 2 9.26h7.61z"
            />
          </svg>
          <span className="font-bold text-blue-500">5.0</span>
          <span className="mx-1">
            · 후기 <span className="font-bold text-gray-700">5</span> · 거래내역{' '}
            <span className="font-bold text-gray-700">10</span>
          </span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto bg-white px-4 py-3">
        {/* 자동스크롤 포커스 */}
        <div ref={messagesEndRef} />

        <div className="flex flex-1 flex-col gap-3 bg-white px-4 py-3">
          {grouped.map((group, idx) => (
            <React.Fragment key={group.date}>
              {/* 날짜 구분선 */}
              <div className="my-4 flex items-center">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="px-4 text-xs text-gray-400">{group.date}</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              {Array.isArray(group.messages) && group.messages.length > 0 ? (
                group.messages.map((message: any, index: number) => {
                  return (
                    <Message
                      key={message?.message_id || `message-${index}`}
                      isFromMe={message?.sender.user_id === userId}
                      avatar={message?.sender.profile_img}
                      time={formatKoreanTime(message?.created_at)}
                      read={message?.unreadCount}
                      message={message?.content}
                    />
                  );
                })
              ) : (
                <div className="text-center text-gray-500">메시지가 없습니다.</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-neutral-100 bg-white">
        <form className="flex items-center gap-2 px-2 py-4" onSubmit={handleSendMessage}>
          {!plusMode ? (
            <button
              type="button"
              aria-label="plus"
              onClick={() => setPlusMode(true)}
              className="flex items-center justify-center text-gray-400 transition hover:text-gray-600"
              style={{ fontSize: 24 }}
            >
              <svg width={24} height={24} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" strokeWidth={2} strokeLinecap="round" />
                <line x1="5" y1="12" x2="19" y2="12" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              aria-label="close"
              onClick={() => {
                setPlusMode(false);
                inputRef.current?.focus();
              }}
              className="flex items-center justify-center text-gray-400 transition hover:text-gray-600"
              style={{ fontSize: 24 }}
            >
              <svg width={24} height={24} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <line x1="6" y1="6" x2="18" y2="18" strokeWidth={2} strokeLinecap="round" />
                <line x1="18" y1="6" x2="6" y2="18" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
          )}

          <div className="flex flex-1 items-center">
            <div className="flex w-full items-center rounded-xl bg-gray-100 px-4 py-2 transition">
              <input
                ref={inputRef}
                className={`flex-1 border-none bg-transparent text-base placeholder-gray-400 outline-none ${
                  input.length > 0 ? 'text-gray-900' : 'text-gray-400'
                }`}
                type="text"
                value={input}
                placeholder="메시지 보내기"
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                disabled={sendMessageMutation.isPending}
              />
            </div>
          </div>

          <button
            type="submit"
            aria-label="send"
            className={`ml-1 flex-shrink-0 ${
              input.length > 0 ? 'text-blue-400' : 'text-gray-400'
            } transition hover:text-blue-500`}
            disabled={sendMessageMutation.isPending || !input.trim()}
          >
            <svg
              width={26}
              height={26}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M3 20l18-8-18-8v6l15 2-15 2v6z" />
            </svg>
          </button>
        </form>

        {plusMode && (
          <div className="mt-3 flex w-full gap-6 px-4 pb-2">
            {plusItems.map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-12 w-12 rounded bg-gray-100" />
                <span className="mt-1 text-sm text-gray-400">장소</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
