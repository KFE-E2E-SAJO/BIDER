import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/model/authStore';
import { createClient } from '@/shared/lib/supabase/client';

export const useMessageRealtimeForList = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel('chat_list_updates');
    // 1. message 테이블 변경 감지 (새 메시지, 읽음 상태 변경 등)
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'message',
      },
      () => {
        queryClient.invalidateQueries({ queryKey: ['chatList'] });
      }
    );

    // 2. chat_room 테이블 변경 감지 (새 채팅방 생성)
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_room',
        filter: `exhibit_user_id=eq.${userId}`,
      },
      () => {
        queryClient.invalidateQueries({ queryKey: ['chatList'] });
      }
    );

    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_room',
        filter: `bid_user_id=eq.${userId}`,
      },
      () => {
        queryClient.invalidateQueries({ queryKey: ['chatList'] });
      }
    );

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);
};
