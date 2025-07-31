'use client';

import { Input } from '@repo/ui/components/Input/Input';
import { cn } from '@repo/ui/lib/utils';
import { Camera, SendHorizontal } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ChatInputBar = () => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600); // 모바일 기준 너비
    };

    handleResize(); // 초기 판단
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let isMessageSendable = Boolean(message.length > 0);

  return (
    <div
      className={cn(
        'bg-neutral-0 fixed bottom-0 left-[50%] flex w-full max-w-[600px] translate-x-[-50%] items-center gap-[12px] border-t border-neutral-100 px-[16px] pt-[12px]',
        !isMobile ? 'pb-[34px]' : isFocused ? 'pb-[12px]' : 'pb-[34px]'
      )}
    >
      <div className="bg-neutral-050 flex flex-1 items-center rounded-[10px]">
        <Input
          placeholder="메시지 보내기"
          inputStyle="flex-1 border-none bg-neutral-050 placeholder:text-neutral-400 rounded-[10px] !focus-visible:border-none !focus-visible:ring-0 !ring-0 !shadow-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button className="ring-0" onClick={() => console.log('picture')}>
          <Camera size={24} className="mx-[15px] text-neutral-700" />
        </button>
      </div>
      <button className="ring-0" onClick={() => console.log('send')} disabled={!isMessageSendable}>
        <SendHorizontal
          size={24}
          className={isMessageSendable ? 'text-main' : 'text-neutral-700'}
        />
      </button>
    </div>
  );
};

export default ChatInputBar;
