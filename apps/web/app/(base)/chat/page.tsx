'use client';

import ChatList from '@/features/chat/ui/ChatList';
import { useAuthStore } from '@/shared/model/authStore';
import { useEffect, useState } from 'react';
import { supabase } from '@/shared/lib/supabaseClient';
import Loading from '@/shared/ui/Loading/Loading';
import { RecoilRoot } from 'recoil';

export default function ChatPage() {
  const userId = useAuthStore((state) => state.user?.id);
  const [sessionUser, setSessionUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const safeUser = session?.user
        ? {
            id: session.user.id,
          }
        : null;

      setSessionUser(safeUser);
      setLoading(false);
    };

    getSession();
  }, []);

  // userId가 있으면 userId를 사용하고, 없으면 sessionUser를 사용
  const loggedInUser = userId ? { id: userId } : sessionUser;

  if (loading) {
    return <Loading />;
  }

  return (
    <RecoilRoot>
      <div className="flex h-screen w-full justify-center">
        {loggedInUser && <ChatList loggedInUser={loggedInUser} />}
      </div>
    </RecoilRoot>
  );
}
