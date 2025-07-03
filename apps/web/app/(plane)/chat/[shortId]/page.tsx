import ChatRoom from '@/features/chat/ui/ChatRoom';

export default function ChatRoomPage({ params }: { params: { shortId: string } }) {
  return (
    <div className="flex h-screen w-full justify-center bg-gray-50">
      <div className="w-full max-w-lg">
        <ChatRoom roomId={params.shortId} />
      </div>
    </div>
  );
}
