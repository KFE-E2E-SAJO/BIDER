'use client';

import React, { useEffect, useRef } from 'react';
import { DateDivider } from '@/features/chat/room/ui/DateDivider';
import MyMessage from '@/features/chat/room/ui/MyMessage';
import YourMessage from '@/features/chat/room/ui/YourMessage';
import { MessageWithProfile } from '@/entities/message/model/types';
import { useAuthStore } from '@/shared/model/authStore';
import { useMessages } from '../model/useMessages';
import Loading from '@/shared/ui/Loading/Loading';
import { useMessageRealtime } from '../api/useMessageRealtime';
import { setMessagesRead } from '../api/setMessageRead';

const MessageList = ({ shortId, isChatEnd }: { shortId: string; isChatEnd: boolean }) => {
  const { data, isLoading, error } = useMessages(shortId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);
  const userId = useAuthStore((state) => state.user?.id) as string;
  useMessageRealtime(shortId);

  // 초기 로드 시 스크롤
  useEffect(() => {
    if (data && data.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
      prevMessageCountRef.current = data.length;
    }
    setMessagesRead(shortId);
  }, [isLoading]); // isLoading이 false가 될 때 실행

  // 새 메시지가 추가될 때 스크롤
  useEffect(() => {
    if (data && data.length > prevMessageCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      prevMessageCountRef.current = data.length;
    }
    setMessagesRead(shortId);
  }, [data?.length]);

  if (isLoading) return <Loading />;
  if (error) return <p>오류: {(error as Error).message}</p>;
  if (!data || (data.length === 0 && !isChatEnd))
    return (
      <div className="p-box flex-1 overflow-y-auto pb-[30px]">
        <p className="pt-[30px] text-center">아직 대화가 없습니다.</p>
      </div>
    );

  const messages = data;

  return (
    <div className="p-box flex-1 overflow-y-auto pb-[30px]">
      {data?.map((message: MessageWithProfile, index) => {
        // 최초 메세지이거나 이전 메세지와 날짜가 달라진 경우 DateDivider
        const currentDate = new Date(message.created_at);

        // 이전 메시지가 존재하는지 체크
        const prevMessage = data && index > 0 ? messages[index - 1] : undefined;
        const nextMessage = data && index < messages.length - 1 ? messages[index + 1] : undefined;
        const prevDate = prevMessage ? new Date(prevMessage.created_at) : undefined;
        const nextDate = nextMessage ? new Date(nextMessage.created_at) : undefined;

        const isFirstMessage = index === 0;
        const isDifferentDay = prevDate
          ? currentDate.getFullYear() !== prevDate.getFullYear() ||
            currentDate.getMonth() !== prevDate.getMonth() ||
            currentDate.getDate() !== prevDate.getDate()
          : false;

        const isLastMessage = index === messages.length - 1;
        const isNextSameTime = nextDate
          ? currentDate.getHours() === nextDate.getHours() &&
            currentDate.getMinutes() === nextDate.getMinutes()
          : false;
        const isNextSameDay = nextDate
          ? currentDate.getFullYear() === nextDate.getFullYear() &&
            currentDate.getMonth() === nextDate.getMonth() &&
            currentDate.getDate() === nextDate.getDate()
          : false;

        const isSameUserTalking = prevMessage ? prevMessage.sender_id === message.sender_id : false;
        const willSameUserTalk = nextMessage ? nextMessage.sender_id === message.sender_id : false;
        const showTime = !willSameUserTalk || !isNextSameTime || !isNextSameDay;
        const returnMessage = (
          <div key={message.message_id}>
            {(isFirstMessage || isDifferentDay) && <DateDivider isoDate={message.created_at} />}
            {userId === message.sender_id ? (
              <MyMessage
                className={
                  isFirstMessage || isDifferentDay
                    ? ''
                    : isSameUserTalking
                      ? 'mt-[10px]'
                      : 'mt-[20px]'
                }
                text={message.content}
                showTime={showTime}
                time={message.created_at}
                isRead={message.is_read}
                isLast={isLastMessage}
              />
            ) : (
              <YourMessage
                className={
                  isFirstMessage || isDifferentDay
                    ? ''
                    : isSameUserTalking
                      ? 'mt-[10px]'
                      : 'mt-[20px]'
                }
                text={message.content}
                showTime={showTime}
                showAvatar={isDifferentDay || !isSameUserTalking}
                time={message.created_at}
                avatar={message.profile?.profile_img}
              />
            )}
          </div>
        );

        return returnMessage;
      })}
      {isChatEnd && (
        <div className="my-[30px] text-center text-neutral-600">
          상대방이 채팅을 종료했습니다. <br />
          대화를 이어가시려면 새로운 채팅방을 생성해주세요.
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
