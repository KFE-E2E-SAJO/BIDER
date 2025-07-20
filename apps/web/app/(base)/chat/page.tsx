'use client';

import ChatList from '@/features/chat/ui/ChatList';
import { useAuthStore } from '@/shared/model/authStore';
import { useEffect, useState } from 'react';
import { anonSupabase } from '@/shared/lib/supabaseClient';
import Loading from '@/shared/ui/Loading/Loading';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function ChatPage() {
  const userId = useAuthStore((state) => state.user?.id);
  const [sessionUser, setSessionUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await anonSupabase.auth.getSession();
      setSessionUser(session?.user ? { id: session.user.id } : null);
      setLoading(false);
    };
    getSession();
  }, []);

  const effectiveUserId =
    typeof userId === 'object' && userId !== null
      ? (userId as { id: string }).id
      : (userId ?? sessionUser?.id ?? null);

  if (loading) return <Loading />;

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <div className="flex h-screen w-full justify-center">{effectiveUserId && <ChatList />}</div>
      </RecoilRoot>
    </QueryClientProvider>
  );
}
