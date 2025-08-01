'use client';

import React, { useEffect, useRef } from 'react';
import { DateDivider } from '@/features/chat/room/ui/DateDivider';
import MyMessage from '@/features/chat/room/ui/MyMessage';
import YourMessage from '@/features/chat/room/ui/YourMessage';

const MessageList = () => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, []);

  // 메시지 수가 변할 때마다 아래로 스크롤
  //   useEffect(() => {
  //     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  //     }, [messages.length]);

  return (
    <div className="p-box flex-1 overflow-y-auto pt-[30px]">
      <DateDivider isoDate={'2025-06-17T09:32:00.000Z'} />
      <MyMessage
        text={'안녕하세요! 제품 상태에 대해 더 자세히 알 수 있을까요?'}
        showTime={true}
        isRead={true}
        isLast={false}
      />
      <YourMessage
        className="mt-[20px]"
        text={'새 상품입니다~!'}
        showTime={false}
        showAvatar={true}
      />
      <YourMessage
        className="mt-[10px]"
        text={'개봉도 안 했어요ㅎㅎ'}
        showTime={true}
        showAvatar={false}
      />
      <MyMessage
        className="mt-[20px]"
        text={'넵 감사합니다~'}
        showTime={true}
        isRead={true}
        isLast={true}
      />
      <DateDivider isoDate={'2025-06-17T09:32:00.000Z'} />
      <MyMessage
        text={'안녕하세요! 제품 상태에 대해 더 자세히 알 수 있을까요?'}
        showTime={true}
        isRead={true}
        isLast={false}
      />
      <YourMessage
        className="mt-[20px]"
        text={'새 상품입니다~!'}
        showTime={false}
        showAvatar={true}
      />
      <YourMessage
        className="mt-[10px]"
        text={'개봉도 안 했어요ㅎㅎ'}
        showTime={true}
        showAvatar={false}
      />
      <MyMessage
        className="mt-[20px]"
        text={'넵 감사합니다~'}
        showTime={true}
        isRead={true}
        isLast={true}
      />
      <DateDivider isoDate={'2025-06-17T09:32:00.000Z'} />
      <MyMessage
        text={'안녕하세요! 제품 상태에 대해 더 자세히 알 수 있을까요?'}
        showTime={true}
        isRead={true}
        isLast={false}
      />
      <YourMessage
        className="mt-[20px]"
        text={'새 상품입니다~!'}
        showTime={false}
        showAvatar={true}
      />
      <YourMessage
        className="mt-[10px]"
        text={'개봉도 안 했어요ㅎㅎ'}
        showTime={true}
        showAvatar={false}
      />
      <MyMessage
        className="mt-[20px]"
        text={'넵 감사합니다~'}
        showTime={true}
        isRead={true}
        isLast={true}
      />
      <DateDivider isoDate={'2025-06-17T09:32:00.000Z'} />
      <MyMessage
        text={'안녕하세요! 제품 상태에 대해 더 자세히 알 수 있을까요?'}
        showTime={true}
        isRead={true}
        isLast={false}
      />
      <YourMessage
        className="mt-[20px]"
        text={'새 상품입니다~!'}
        showTime={false}
        showAvatar={true}
      />
      <YourMessage
        className="mt-[10px]"
        text={'개봉도 안 했어요ㅎㅎ'}
        showTime={true}
        showAvatar={false}
      />
      <MyMessage
        className="mt-[20px]"
        text={'넵 감사합니다~'}
        showTime={true}
        isRead={true}
        isLast={true}
      />
      <DateDivider isoDate={'2025-06-17T09:32:00.000Z'} />
      <MyMessage
        text={'안녕하세요! 제품 상태에 대해 더 자세히 알 수 있을까요?'}
        showTime={true}
        isRead={true}
        isLast={false}
      />
      <YourMessage
        className="mt-[20px]"
        text={'새 상품입니다~!'}
        showTime={false}
        showAvatar={true}
      />
      <YourMessage
        className="mt-[10px]"
        text={'개봉도 안 했어요ㅎㅎ'}
        showTime={true}
        showAvatar={false}
      />
      <MyMessage
        className="mt-[20px]"
        text={'넵 감사합니다~'}
        showTime={true}
        isRead={true}
        isLast={true}
      />
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
