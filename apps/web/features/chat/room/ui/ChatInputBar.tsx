'use client';

import { Input } from '@repo/ui/components/Input/Input';
import { Camera, SendHorizontal } from 'lucide-react';
import React, { useState } from 'react';

const ChatInputBar = () => {
  const [message, setMessage] = useState('');
  let isMessageSendable = Boolean(message.length > 0);

  return (
    <div className="bg-neutral-0 fixed bottom-0 left-0 flex w-full items-center gap-[12px] border-t border-neutral-100 px-[16px] pb-[34px] pt-[12px]">
      <div className="bg-neutral-050 flex flex-1 items-center rounded-[10px]">
        <Input
          placeholder="메시지 보내기"
          inputStyle="flex-1 border-none bg-neutral-050 placeholder:text-neutral-400 rounded-[10px] !focus-visible:border-none !focus-visible:ring-0 !ring-0"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
