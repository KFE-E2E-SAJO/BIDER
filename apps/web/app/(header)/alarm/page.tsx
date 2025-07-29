'use client';

import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { useAlarmList } from '@/features/alarm/useAlarmList';
import Line from '@/shared/ui/Line/Line';
import Image from 'next/image';

const Alarm = () => {
  const { alarms, isLoading, handleAlarmClick, handleAlarmDelete } = useAlarmList();

  if (isLoading) {
    return <div className="p-box pt-[23px]">로딩 중...</div>;
  }

  if (alarms.length === 0) {
    return <div className="p-box pt-[23px]">알림이 없습니다.</div>;
  }

  const trailingActions = (alarmId: number) => (
    <TrailingActions>
      <SwipeAction destructive={true} onClick={() => handleAlarmDelete(alarmId)}>
        <div className="bg-danger flex h-full items-center justify-center gap-2 px-4 text-white">
          <span className="text-neutral-0 flex items-center justify-center font-medium">삭제</span>
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <SwipeableList>
      {alarms.map((alarm) => (
        <SwipeableListItem key={alarm.id} trailingActions={trailingActions(alarm.id)}>
          <div
            onClick={() => handleAlarmClick(alarm.id)}
            className={`p-box cursor-pointer pt-[23px] ${alarm.isRead ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="ml-[10px] mr-[27px]">
                <p className="typo-body-regular mb-[3px] text-neutral-900">{alarm.contents}</p>
                <span className="typo-caption-regular text-neutral-400">{alarm.time}</span>
              </div>
              <Image src={alarm.image} alt="" width={50} height={50} className="rounded-sm" />
            </div>
            <Line className="my-[15px]" />
          </div>
        </SwipeableListItem>
      ))}
    </SwipeableList>
  );
};

export default Alarm;
