import { createClient } from '@/shared/lib/supabase/client';
import { useAuthStore } from '@/shared/model/authStore';
import { useEffect } from 'react';
import { useUnreadStore } from '../model/unreadStore';

export const useUnreadMessagesCount = () => {
  const userId = useAuthStore((state) => state.user?.id) as string;
  const supabase = createClient();
  const { setCount, increase, decrease } = useUnreadStore();

  useEffect(() => {
    if (!userId) return;

    // 1. 초기 읽지 않은 메세지 수 가져오기
    const fetchInitialUnreadMessages = async () => {
      const { data, error } = await supabase.rpc('get_unread_message_count', {
        user_id: userId,
      });

      if (error) {
        throw new Error('읽지 않은 메세지 수 초기 조회 실패', error);
      }
      setCount(data || 0);
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
          increase(1);
        }
      }
    );

    // UPDATE 감지
    // 1. is_read: false → true로 바뀐 경우 감소
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
          decrease(1);
        }
      }
    );

    // 2. 채팅방 나가기(활성 상태 변경) 감지
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_room',
      },
      async (payload) => {
        const oldRoom = payload.old;
        const newRoom = payload.new;

        // 내가 나간 경우만 감지 (bid_user인지 exhibit_user인지에 따라)
        const isSelfLeaved =
          (newRoom.bid_user_id === userId && newRoom.bid_user_active === false) ||
          (newRoom.exhibit_user_id === userId && newRoom.exhibit_user_active === false);

        if (!isSelfLeaved) return;

        // 3. 내가 나간 방의 미읽은 메시지 수 계산
        const { count, error } = await supabase
          .from('message')
          .select('message_id', { count: 'exact' })
          .eq('chatroom_id', newRoom.chatroom_id)
          .eq('is_read', false)
          .neq('sender_id', userId);

        if (!error && count && count > 0) {
          decrease(count);
        }
      }
    );
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
};
