'use client';

import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { Textarea } from '@repo/ui/components/Textarea/Textarea';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
// import { useRecoilValue } from 'recoil';
import {
  getUserById,
  sendMessage,
  getAllMessages,
  // selectedUserIdState,
  // selectedUserIndexState,
} from '../model/chatActions';

const sellerAvatar = 'https://cdn-icons-png.flaticon.com/512/616/616408.png'; // 곰돌이 이미지(예시, 원하면 대체)
const productImage = 'https://via.placeholder.com/44'; // 실제 상품 이미지로 교체 가능

export default function ChatRoom({ roomId }: { roomId: string }) {
  const [input, setInput] = useState('');
  const [plusMode, setPlusMode] = useState(false);
  // const selectedUserId = useRecoilValue(selectedUserIdState);
  // const selectedUserIndex = useRecoilValue(selectedUserIndexState);
  const [Message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // const selectedUserQuery = useQuery({
  //   queryKey: ['profile', selectedUserId],
  //   queryFn: () => getUserById(selectedUserId),
  // });
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

  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, receiver_id }: { content: string; receiver_id: string }) => {
      return sendMessage({ content, receiver_id });
    },
    onSuccess: () => {
      setMessage('');
      getAllMessagesQuery.refetch();
    },
  });

  const getAllMessagesQuery = useQuery({
    queryKey: ['messages', roomId],
    queryFn: () => getAllMessages(roomId),
  });

  return (
    <div className="flex min-h-screen w-full max-w-[1920px] flex-col bg-white">
      {/* 상단 바 */}
      <div className="flex flex-col gap-2 border-b px-4 pb-2 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="mr-1">
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
            <span className="text-base font-semibold">입찰매니아</span>
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
          <img src={productImage} alt="상품 이미지" className="h-9 w-9 rounded-md object-cover" />
          <div className="flex min-w-0 flex-col justify-center">
            <div className="truncate text-[13px] font-medium">아이폰 14pro 128G 팝니다</div>
            <div className="text-[15px] font-bold">200,000원</div>
          </div>
          <span className="ml-auto rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
            경매 종료
          </span>
        </div>
      </div>

      {/* 채팅 내역 */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-white px-4 py-3">
        {/* 프로필(닉네임/후기/거래내역) */}
        <div className="my-3 flex flex-col items-center gap-1 text-xs text-gray-500">
          <Avatar className="h-16 w-16 rounded-full border border-gray-200" />
          <span className="text-base font-bold text-gray-900">입찰매니아</span>
          <span>
            <span className="font-bold text-blue-500">★</span> 5.0 · 후기{' '}
            <span className="font-bold text-gray-700">5</span> · 거래내역{' '}
            <span className="font-bold text-gray-700">10</span>
          </span>
        </div>

        {/* 날짜 구분선 */}
        <div className="my-2 flex w-full items-center">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="whitespace-nowrap px-4 text-sm text-gray-400">2025년 6월 17일</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* 내 메시지(파란말풍선) */}
        <div className="mt-2 flex flex-row-reverse items-end gap-2">
          <Avatar
            src={sellerAvatar}
            alt="나"
            className="h-8 w-8 rounded-full border border-gray-200"
          />
          <div>
            <Textarea
              variant="chat"
              value="안녕하세요! 제품 상태에 대해 더 자세히 알 수 있을까요?"
              className="bg-main text-neutral-0"
            />
            <div className="mt-1 text-right text-xs text-gray-400">오후 3:51</div>
          </div>
        </div>

        {/* 상대 메시지(회색말풍선 + 아바타) */}
        <div className="mt-1 flex items-end gap-2">
          <Avatar alt="입찰매니아" className="h-8 w-8 rounded-full border border-gray-200" />
          <div>
            <Textarea variant="chat" value="새 상품 입니다~!" />
            <div className="mt-1 text-xs text-gray-400">오후 4:20</div>
          </div>
        </div>

        {/* 내 메시지(파란말풍선) + 읽음 */}
        <div className="mt-1 flex flex-row-reverse items-end gap-2">
          <Avatar
            src={sellerAvatar}
            alt="나"
            className="h-8 w-8 rounded-full border border-gray-200"
          />
          <div>
            <Textarea variant="chat" value="넵 감사합니다~" className="bg-main text-neutral-0" />
            <div className="mt-1 text-right text-xs text-gray-400">
              <span className="font-bold text-gray-400">읽음 </span>
              오후 4:42
            </div>
          </div>
        </div>

        {/* 날짜 구분선 */}
        <div className="my-2 flex w-full items-center">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="whitespace-nowrap px-4 text-sm text-gray-400">2025년 6월 20일</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
      </div>

      {/* 입력창 */}
      <form
        className="flex w-full items-center gap-2 bg-white px-2 py-4"
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
            onClick={handlePlusClick}
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
            onClick={handleCloseClick}
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
          <div
            className={`flex w-full items-center rounded-xl bg-gray-100 px-4 py-2 ${plusMode ? '' : ''} transition`}
          >
            <input
              ref={inputRef}
              className={`flex-1 border-none bg-transparent text-base placeholder-gray-400 outline-none ${input.length > 0 ? 'text-gray-900' : 'text-gray-400'} `}
              type="text"
              value={input}
              placeholder="메시지 보내기"
              onChange={(e) => {
                setInput(e.target.value);
                setMessage(e.target.value);
              }}
              style={{ minWidth: 0 }}
            />
            <button
              type="button"
              aria-label="camera"
              className="ml-2 flex items-center text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              <svg
                width={22}
                height={22}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect x="4" y="7" width="16" height="10" rx="3" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        {/* 전송(비행기) 버튼 */}
        <button
          type="submit"
          aria-label="send"
          className={`ml-1 flex-shrink-0 ${input.length > 0 ? 'text-blue-400' : 'text-gray-400'} transition hover:text-blue-500`}
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
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-12 w-12 rounded bg-gray-100" />
              <span className="mt-1 text-sm text-gray-400">장소</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
