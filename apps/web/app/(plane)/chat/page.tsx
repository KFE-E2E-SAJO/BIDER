import ChatList from '@/features/chat/ui/ChatList';
import ChatRoom from '@/features/chat/ui/ChatRoom';
import { createServerSupabaseClient } from '@/shared/lib/supabaseServer';
import { createServer } from 'http';

export default async function ChatPage() {
  const supabase = await createServerSupabaseClient();
  const hardcodeUser = { id: '0f521e94-ed27-479f-ab3f-e0c9255886c5' };
  const {
    data: { session },
  } = await supabase.auth.getSession(); // 세션을 못가져와서 현재 로그인된 유저를 못받아오는 듯 그래서 아래 렌더링이 안됨....
  return (
    <div className="flex h-screen w-full justify-center">
      <ChatRoom />
      {/* {(session?.user || hardcodeUser) && <ChatList loggedInUser={session?.user || hardcodeUser} />} */}
    </div>
  );
}
