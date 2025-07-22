'use client';

import React from 'react';

type MessageProps = {
  isFromMe: boolean;
  avatar?: string;
  time?: string;
  read?: boolean;
  message: string;
};

export const Message = ({ isFromMe, avatar, time, read, message }: MessageProps) => {
  // 시간 + 읽음 (내 메시지일 때만)
  const timeElem = (
    <span className="mb-0.5 ml-1 text-xs text-gray-400">
      {isFromMe && read && <span className="mr-1 font-bold">읽음</span>}
      {time}
    </span>
  );

  // 내 메시지 (오른쪽)
  if (isFromMe) {
    return (
      <div className="my-2 flex items-end justify-end gap-2">
        <div className="w-fit break-all rounded-xl bg-blue-400 px-4 py-2 text-sm font-medium text-white">
          {message}
        </div>
        {timeElem}
      </div>
    );
  }

  // 상대 메시지 (왼쪽)
  return (
    <div className="my-2 flex items-end justify-start gap-2">
      <img src={avatar || '/default-profile.png'} className="h-8 w-8 rounded-full" />
      <div className="w-fit break-all rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800">
        {message}
      </div>
      {timeElem}
    </div>
  );
};
