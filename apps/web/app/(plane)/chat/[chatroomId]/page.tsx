import ChatRoomClient from './ChatRoomClient';
import { use } from 'react';

export default function ChatRoomPage({ params }: { params: Promise<{ chatroomId: string }> }) {
  const { chatroomId } = use(params);
  return <ChatRoomClient roomId={chatroomId} />;
}
