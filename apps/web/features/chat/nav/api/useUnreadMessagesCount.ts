import { createClient } from '@/shared/lib/supabase/client';
import { useAuthStore } from '@/shared/model/authStore';
import { useEffect, useState } from 'react';

export const useUnreadMessagesCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = useAuthStore((state) => state.user?.id) as string;
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    // 1. 초기 읽지 않은 메세지 수 가져오기
    const fetchInitialUnreadMessages = async () => {
      const { count, error } = await supabase
        .from('message')
        .select('message_id', { count: 'exact' })
        .eq('is_read', false)
        .neq('sender_id', userId);

      if (error) {
        throw new Error('읽지 않은 메세지 수 초기 조회 실패', error);
      }
      setUnreadCount(count || 0);
    };

    fetchInitialUnreadMessages();

    // 2. realtime 구독 설정
    const channel = supabase.channel('unread_messages');

    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'message',
      },
      (payload) => {
        const newMessage = payload.new;
        if (newMessage.sender_id !== userId && newMessage.is_read === false) {
          setUnreadCount((prevCount) => prevCount + 1);
        }
      }
    );

    // UPDATE 감지 → is_read: false → true로 바뀐 경우에만 감소
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'message',
      },
      (payload) => {
        const oldMessage = payload.old;
        const newMessage = payload.new;

        const wasUnread = oldMessage.is_read === false;
        const nowRead = newMessage.is_read === true;

        // 내가 받은 메시지면서 읽음 처리된 경우만 처리
        if (newMessage.sender_id !== userId && wasUnread && nowRead) {
          setUnreadCount((prev) => Math.max(prev - 1, 0));
        }
      }
    );
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
  return unreadCount;
};
