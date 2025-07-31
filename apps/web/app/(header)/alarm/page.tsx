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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/Dialog/Dialog';
import { Button } from '@repo/ui/components/Button/Button';
import { useState } from 'react';

const Alarm = () => {
  const { alarms, isLoading, handleAlarmClick, handleAlarmDelete } = useAlarmList();

  const [selectedAlarmId, setSelectedAlarmId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
    return <div className="p-box pt-[23px]">로딩 중...</div>;
  }

  if (alarms.length === 0) {
    return <div className="p-box pt-[23px]">알림이 없습니다.</div>;
  }

  const handleCancelDelete = () => {
    setSelectedAlarmId(null);
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedAlarmId != null) {
      handleAlarmDelete(selectedAlarmId);
      setSelectedAlarmId(null);
      setIsDialogOpen(false);
    }
    setIsDialogOpen(false);
  };

  const trailingActions = (alarmId: number) => (
    <TrailingActions>
      <SwipeAction
        destructive={false}
        onClick={() => {
          setSelectedAlarmId(alarmId);
          setIsDialogOpen(true);
        }}
      >
        <div
          className="bg-danger flex h-full w-[80px] items-center justify-center px-4 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="whitespace-nowrap text-sm font-medium leading-none">삭제</span>
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <>
      <SwipeableList threshold={0.1}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>작업 선택</DialogTitle>
        </DialogHeader>
        <DialogContent showCloseButton={false}>
          <div className="typo-subtitle-small-medium py-[25px] text-center">
            알림이 삭제됩니다
            <br />
            계속하시겠습니까?
          </div>
          <div className="flex items-center justify-center border-t border-neutral-100">
            <Button onClick={handleCancelDelete} variant="ghost" className="w-1/2">
              <span>취소</span>
            </Button>
            <Button onClick={handleConfirmDelete} variant="ghost" className="text-danger w-1/2">
              <span>삭제하기</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Alarm;
