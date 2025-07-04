import ChatRoomClient from './ChatRoomClient';

export default async function ChatRoomPage({ params }: { params: { shortId: string } }) {
  const { shortId } = await params;
  return <ChatRoomClient roomId={shortId} />;
}
