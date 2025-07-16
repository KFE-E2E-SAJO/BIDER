'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Message } from './Message';
import { useRecoilValue } from 'recoil';
import {
  getUserById,
  sendMessage,
  getAllMessages,
  getAllUsers,
} from '../../../app/model/chatActions';
import { presenceState, selectedUserIdState, selectedUserIndexState } from '../lib/atoms';
import { useAuthStore } from '@/shared/model/authStore';
import { supabase } from '../../../shared/lib/supabaseBrowserClient';
import { useRouter } from 'next/navigation';

// 기타 import는 동일
const productImage = 'https://via.placeholder.com/44';

export default function ChatRoom({ roomId }: { roomId: string }) {
  const userId = useAuthStore((state) => state.user?.id);
  const [message, setMessage] = useState('');
  const [input, setInput] = useState('');
  const [plusMode, setPlusMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const plusItems = ['location', 'photo', 'file', 'contact'];
  const selectedUserId = useRecoilValue(selectedUserIdState);
  const selectedUserIndex = useRecoilValue(selectedUserIndexState);
  const presence = useRecoilValue(presenceState);
  const queryClient = useQueryClient();
  const router = useRouter();

  // const {
  //   data: messages = [],
  //   isLoading,
  //   error,
  //   refetch,
  // } = useQuery({
  //   queryKey: ['messages', userId, roomId],
  //   queryFn: () => getAllMessages(roomId, userId!),
  //   enabled: !!userId && !!roomId,
  // });

  // const handleSendMessage = async (content: string) => {
  //   if (!userId || !roomId || !content) return;
  //   await sendMessage({ content, userId: userId, chatroom_id: roomId });
  //   // 쿼리 refetch!
  //   queryClient.invalidateQueries({ queryKey: ['messages', userId, roomId] });
  // };

  // + 버튼 클릭 시
  const handlePlusClick = () => {
    setPlusMode(true);
  };

  // X 버튼 클릭 시
  const handleCloseClick = () => {
    setPlusMode(false);
    // 입력창에 포커스
    inputRef.current?.focus();
  };

  const { data: chatRoomsWithImage = [] } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: async () => {
      const res = await fetch('/api/chat-rooms');
      return res.json();
    },
  });

  const { data: getProductInfo = [] } = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const res = await fetch('/api/chat-rooms/[shortId]');
      return res.json();
    },
  });

  const getAllUsersQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => getAllUsers(),
  });

  const selectedUserQuery = useQuery({
    queryKey: ['profile', selectedUserId],
    queryFn: () => getUserById(selectedUserId!),
    enabled: !!selectedUserId && typeof selectedUserId === 'string',
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return sendMessage({ content, chatroom_id: roomId, userId });
    },
    onSuccess: () => {
      setMessage('');
      getAllMessagesQuery.refetch();
    },
  });

  // function getUuid(val: any): string | undefined {
  //   if (!val) return undefined;
  //   if (typeof val === 'string') return val;
  //   if (typeof val === 'object' && val !== null) {
  //     if (val.id && typeof val.id === 'string') return val.id;
  //     if (val.user && val.user.id && typeof val.user.id === 'string') return val.user.id;
  //   }
  //   return undefined;
  // }

  // const convertedId = getUuid(selectedUserId);

  // console.log('실제로 사용되는 userId:', convertedId);

  const getAllMessagesQuery = useQuery({
    queryKey: ['messages', userId, roomId],
    queryFn: () => getAllMessages(roomId, userId!),
    enabled: !!userId && !!roomId,
  });

  useEffect(() => {
    interface MessagePayload {
      eventType: string;
      errors?: any;
      new?: any;
      old?: any;
    }

    interface PostgresChangesConfig {
      event: 'INSERT' | 'UPDATE' | 'DELETE';
      schema: string;
      table: string;
    }

    const channel = supabase
      .channel('message_postgres_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message',
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT' && !payload.errors) {
            getAllMessagesQuery.refetch();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-white">
      {/* 상단 바 */}
      <div className="flex flex-col gap-2 border-b px-4 pb-2 pt-4">
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
            <span className="text-base font-semibold">{getAllUsersQuery.data?.[0]?.nickname}</span>
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
          {chatRoomsWithImage.map((chatrooms: any) => (
            <img
              key={chatrooms.chatroom_id}
              src={chatrooms.product_image_url}
              alt="Product Image"
              className="h-9 w-9 rounded-md object-cover"
            />
          ))}
          {getProductInfo.map((product: any) => (
            <div key={product.id} className="flex min-w-0 flex-col justify-center">
              <div className="truncate text-[13px] font-medium">{product.title}</div>
              <div className="text-[15px] font-bold">{product.min_price.toLocaleString()}원</div>
            </div>
          ))}
          <span className="ml-auto rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
            경매 종료
          </span>
        </div>
      </div>

      {/* 채팅 메시지 영역 - 스크롤 가능, flex-1로 영역 차지 */}
      <div className="flex-1 overflow-y-auto bg-white px-4 py-3">
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-white px-4 py-3">
          {getAllMessagesQuery.data?.map((message) => (
            <Message
              key={message.message_id}
              isFromMe={message.sender_id === userId}
              message={message.content}
            />
          ))}
        </div>
      </div>

      {/* 입력창 - 항상 하단 고정 */}
      <div className="w-full border-t bg-white">
        <form
          className="flex items-center gap-2 px-2 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              // 메시지 전송 로직
              setInput('');
            }
          }}
        >
          {/* 좌측 버튼 */}
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

          {/* 입력 영역 */}
          <div className="flex flex-1 items-center">
            <div className="flex w-full items-center rounded-xl bg-gray-100 px-4 py-2 transition">
              <input
                ref={inputRef}
                className={`flex-1 border-none bg-transparent text-base placeholder-gray-400 outline-none ${
                  input.length > 0 ? 'text-gray-900' : 'text-gray-400'
                }`}
                type="text"
                value={message || input}
                placeholder="메시지 보내기"
                onChange={(e) => {
                  setInput(e.target.value);
                  setMessage(e.target.value);
                }}
                style={{ minWidth: 0 }}
              />
            </div>
          </div>

          {/* 전송(비행기) 버튼 */}
          <button
            onClick={() => sendMessageMutation.mutate({ content: input })}
            type="submit"
            aria-label="send"
            className={`ml-1 flex-shrink-0 ${
              input.length > 0 ? 'text-blue-400' : 'text-gray-400'
            } transition hover:text-blue-500`}
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

        {/* 플러스 버튼 클릭 시 확장 영역 */}
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
function createBrowserSupabaseClient() {
  throw new Error('Function not implemented.');
}
