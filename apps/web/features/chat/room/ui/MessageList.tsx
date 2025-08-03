'use client';

import React, { useEffect, useRef } from 'react';
import { DateDivider } from '@/features/chat/room/ui/DateDivider';
import MyMessage from '@/features/chat/room/ui/MyMessage';
import YourMessage from '@/features/chat/room/ui/YourMessage';
import { MessageWithProfile } from '@/entities/message/model/types';
import { useAuthStore } from '@/shared/model/authStore';
import { useMessages } from '../model/useMessages';
import Loading from '@/shared/ui/Loading/Loading';

const MessageList = ({ shortId }: { shortId: string }) => {
  const { data, isLoading, error } = useMessages(shortId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userId = useAuthStore((state) => state.user?.id) as string;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <p>오류: {(error as Error).message}</p>;
  if (!data || data.length === 0)
    return (
      <p className="min-h-[calc(100dvh-222px)] pt-[30px] text-center">아직 대화가 없습니다.</p>
    );

  // 메시지 수가 변할 때마다 아래로 스크롤
  //   useEffect(() => {
  //     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  //     }, [messages.length]);

  return (
    <div className="p-box flex-1 overflow-y-auto pb-[30px]">
      {data?.map((message: MessageWithProfile, index) => {
        // 최초 메세지이거나 이전 메세지와 날짜가 달라진 경우 DateDivider
        const currentDate = new Date(message.created_at);

        // 이전 메시지가 존재하는지 체크
        const prevMessage = data && index > 0 ? data[index - 1] : undefined;
        const nextMessage = data && index < data.length - 1 ? data[index + 1] : undefined;
        const prevDate = prevMessage ? new Date(prevMessage.created_at) : undefined;
        const nextDate = nextMessage ? new Date(nextMessage.created_at) : undefined;

        const isFirstMessage = index === 0;
        const isDifferentDay = prevDate
          ? currentDate.getFullYear() !== prevDate.getFullYear() ||
            currentDate.getMonth() !== prevDate.getMonth() ||
            currentDate.getDate() !== prevDate.getDate()
          : false;

        const isLastMessage = index === data.length - 1;
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
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
