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

// 기타 import는 동일

export default function ChatRoom({ roomId, content }: { roomId: string; content: string }) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  console.log('ChatRoom userId:', userId);
  const [input, setInput] = useState('');
  const [plusMode, setPlusMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const plusItems = ['location', 'photo', 'file', 'contact'];
  const selectedUserId = useRecoilValue(selectedUserIdState);
  const selectedUserIndex = useRecoilValue(selectedUserIndexState);
  const presence = useRecoilValue(presenceState);
  const router = useRouter();
  const sendMessageMutation = useSendMessage();

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault(); // form 제출 시에만 preventDefault
    }

    if (!userId || !roomId || !input.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({
        content: input.trim(),
        userId,
        chatroomId: roomId,
      });

      setInput(''); // input만 사용
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

  const { data: chatRoomData, isLoading, isError, error } = useGetChatRoom(content, roomId);

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

  console.log('chatRoomData:', chatRoomData);
  console.log('isLoading:', isLoading);
  console.log('isError:', isError);
  console.log('error:', error);

  const roomData = Array.isArray(chatRoomData) ? chatRoomData[0] : chatRoomData;
  const messages = Array.isArray(chatRoomData)
    ? chatRoomData
    : (chatRoomData as any)?.messages || [];
  console.log('roomData:', roomData);
  console.log('messages:', messages);
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-white">
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
            <span className="text-base font-semibold">
              {(roomData as any)?.bid_user?.nickname || '사용자'}
            </span>
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
            key={roomData?.chatroom_id}
            src={(roomData as any)?.product_image_url}
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
      <div className="flex-1 overflow-y-auto bg-white px-4 py-3">
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-white px-4 py-3">
          {Array.isArray(messages) && messages.length > 0 ? (
            messages.map((message: any, index: number) => {
              return (
                <Message
                  key={message.message_id || `message-${index}`}
                  isFromMe={message.sender_user_id === userId}
                  message={message.content}
                />
              );
            })
          ) : (
            <div className="text-center text-gray-500">메시지가 없습니다.</div>
          )}
        </div>
      </div>

      <div className="w-full border-t bg-white">
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
