'use client';
import { createClient } from '@/shared/lib/supabase/client';
import { useEffect, useState } from 'react';
import { AlarmItem } from './type/types';

export const useAlarmList = () => {
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAlarms() {
      setIsLoading(true);

      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('유저 정보를 가져오는 데 실패했습니다.', userError);
        setIsLoading(false);
        return;
      }
      const userId = user.id;

      const { data: alarmData, error } = await supabase
        .from('alarm')
        .select('*')
        .eq(`user_id`, userId)
        .order('create_at', { ascending: false });

      if (error) {
        console.error('알림 가져오기 실패:', error);
        return;
      } else {
        const formatted = (alarmData ?? []).map((item) => ({
          id: item.alarm_id,
          user_id: item.user_Id,
          contents: item.body,
          time: getTimeDiff(item.create_at),
          image: item.image ?? '/alarm_thumb.png',
          isRead: item.is_read ?? false,
        }));

        setAlarms(formatted);
      }

      setIsLoading(false);
    }

    fetchAlarms();
  }, []);

  //알림 읽음 처리
  const handleAlarmClick = async (alarmId: number) => {
    setAlarms((prev) =>
      prev.map((alarm) => (alarm.id === alarmId ? { ...alarm, isRead: true } : alarm))
    );

    markAlarmAsRead(alarmId);
  };

  // 개별 알림 삭제
  const handleAlarmDelete = async (alarmId: number) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== alarmId));

    const supabase = createClient();
    const { error } = await supabase.from('alarm').delete().eq('alarm_id', alarmId);

    if (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  return { alarms, isLoading, handleAlarmClick, handleAlarmDelete };
};

function getTimeDiff(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

async function markAlarmAsRead(alarmId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('alarm')
    .update({ is_read: true })
    .eq('alarm_id', alarmId);

  if (error) {
    console.error('알림 읽음 처리 실패:', error);
  }
}
