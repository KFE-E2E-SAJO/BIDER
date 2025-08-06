import { supabase } from '@/shared/lib/supabaseClient';
import { useAuthStore } from '@/shared/model/authStore';
import { useEffect, useState } from 'react';

export const useAlarmCount = () => {
  const [unreadAlarmCount, setUnreadAlarmCount] = useState(0);
  const userId = useAuthStore((state) => state.user?.id) as string;

  useEffect(() => {
    if (!userId) return;

    // 1. 초기 읽지 않은 메세지 수 가져오기
    const fetchInitialUnreadAlarms = async () => {
      const { count, error } = await supabase
        .from('alarm')
        .select('alarm_id', { count: 'exact' })
        .eq('is_read', false)
        .eq('user_id', userId);

      if (error) {
        throw new Error('읽지 않은 알림 수 초기 조회 실패', error);
      }
      setUnreadAlarmCount(count || 0);
    };

    fetchInitialUnreadAlarms();

    // 2. realtime 구독 설정
    const channel = supabase.channel('unread_alarms');

    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'alarm',
      },
      (payload) => {
        const newAlarm = payload.new;
        if (newAlarm.is_read === false) {
          setUnreadAlarmCount((prevCount) => prevCount + 1);
        }
      }
    );

    // UPDATE 감지 → is_read: false → true로 바뀐 경우에만 감소
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'alarm',
      },
      (payload) => {
        const oldMessage = payload.old;
        const newMessage = payload.new;

        const wasUnread = oldMessage.is_read === false;
        const nowRead = newMessage.is_read === true;

        // 내가 받은 메시지면서 읽음 처리된 경우만 처리
        if (wasUnread && nowRead) {
          setUnreadAlarmCount((prev) => Math.max(prev - 1, 0));
        }
      }
    );
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
  return unreadAlarmCount;
};
