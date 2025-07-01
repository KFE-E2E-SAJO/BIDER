'use client';

import { Button } from '@repo/ui/components/Button/Button';
import Person from './Person';

export default function ChatScreen() {
  return (
    <div className="flex h-screen w-full flex-col">
      <Person
        index={0}
        userId={'iasdonfiodasn'}
        name={'Lopun'}
        onlineAt={new Date().toISOString()}
        isActive={false}
        onChatScreen={true}
        onClick={() => {}}
      />
      {/* 채팅 영역 */}
      <div className="w-full flex-1 bg-gray-500"></div>
      {/* 채팅창 영역 */}
      <div className="flex">
        <input className="border-light-blue-900 w-full border-2 p-4" />
        <Button className="min-w-20">전송</Button>
      </div>
    </div>
  );
}
