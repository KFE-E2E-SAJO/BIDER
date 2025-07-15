'use client';

import React from 'react';

import { Avatar } from '@repo/ui/components/Avatar/Avatar';
import { Textarea } from '@repo/ui/components/Textarea/Textarea';

type MessageProps = {
  isFromMe: boolean;
  message: string;
};

export const Message = ({ isFromMe, message }: MessageProps) => {
  return (
    <div>
      {/* 채팅 내역 */}
      <Textarea
        variant="chat"
        value={message}
        className={`w-fit ${isFromMe ? 'bg-main text-neutral-0 ml-auto flex' : 'bg-gray-100 text-gray-900'}`}
      />
    </div>
  );
};
