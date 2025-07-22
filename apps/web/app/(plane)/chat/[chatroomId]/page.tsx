import ChatRoomClient from './ChatRoomClient';

export default async function ChatRoomPage({ params }: { params: { chatroomId: string } }) {
  return <ChatRoomClient roomId={params.chatroomId} />;
}
