'use client';

import { getRandomImage } from '@/features/lib/random';
import TimeAgo from 'javascript-time-ago';
import ko from 'javascript-time-ago/locale/ko';

TimeAgo.addDefaultLocale(ko);

const timeAgo = new TimeAgo('ko-KR');

export default function Person({
  index,
  userId,
  name,
  onlineAt,
  isActive = false,
  onChatScreen = false,
  onClick = null,
}: {
  index: number;
  userId: string;
  name: string;
  onlineAt: string;
  isActive: boolean;
  onChatScreen: boolean;
  onClick: (() => void) | null;
}) {
  return (
    <div
      className={`flex w-full min-w-60 ${onClick && 'cursor-pointer'} items-center gap-4 p-4 ${!onChatScreen && isActive && 'bg-light-blue-50'} ${!onChatScreen && !isActive && 'bg-gray-50'} ${onChatScreen && 'bg-gray-50'}`}
      onClick={onClick || undefined}
    >
      <img src={getRandomImage(index)} alt={name} className="h-10 w-10 rounded-full" />
      <div>
        <p className="text-lg font-bold text-black">{name}</p>
        <p className="text-gray-500">{timeAgo.format(Date.parse(onlineAt))}</p>
      </div>
    </div>
  );
}
