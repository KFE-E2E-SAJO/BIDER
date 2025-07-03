'use client';
import { RecoilRoot } from 'recoil';
import ChatRoom from '@/features/chat/ui/ChatRoom';

export default function ChatRoomClient({ roomId }: { roomId: string }) {
  return (
    <RecoilRoot>
      <ChatRoom roomId={roomId} />
    </RecoilRoot>
  );
}
