import Person from '@/features/chat/ui/Person';

export default function ChatPage() {
  return (
    <div className="flex h-screen w-full justify-center">
      <Person
        index={0}
        userId={'iasdonfiodasn'}
        name={'Lopun'}
        onlineAt={new Date().toISOString()}
        isActive={false}
        onChatScreen={false}
      />
    </div>
  );
}
