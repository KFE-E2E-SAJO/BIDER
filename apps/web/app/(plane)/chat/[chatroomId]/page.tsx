import ChatRoomClient from './ChatRoomClient';

export default async function ChatRoomPage({
  params,
  content,
}: {
  params: { chatroomId: string };
  content: any;
}) {
  return <ChatRoomClient content={content} roomId={params.chatroomId} />;
}
