'use client';

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
import SwipeableItem from '@/shared/ui/listItem/SwipeableItem';

const Alarm = () => {
  const { alarms, isLoading, handleAlarmClick, handleAlarmDelete } = useAlarmList();

  const [selectedAlarmId, setSelectedAlarmId] = useState<number | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleConfirmDelete = (alarmId?: number) => {
    const idToDelete = alarmId || selectedAlarmId;
    if (idToDelete) {
      handleAlarmDelete(idToDelete);
      setSelectedAlarmId(null);
      setIsDialogOpen(false);
    }
  };

  const handleOpen = (id: string) => {
    // 이미 같은 아이템이 열려있으면 무시
    if (openItemId === id) return;

    // 다른 아이템이 열려있으면 즉시 닫고 새 아이템 열기
    setOpenItemId(id);
  };

  const handleClose = () => {
    setOpenItemId(null);
  };

  const handleDeleteClick = (alarmId: number) => {
    setSelectedAlarmId(alarmId);
    setIsDialogOpen(true);
    setOpenItemId(null); // 스와이프 상태 닫기
  };

  return (
    <>
      <div className="w-full overflow-x-hidden">
        {alarms.map((alarm) => (
          <div key={alarm.id} className="relative overflow-hidden">
            <SwipeableItem
              isOpen={openItemId === alarm.id.toString()}
              onOpen={() => handleOpen(alarm.id.toString())}
              onClose={handleClose}
              onDragChange={(dragging) => setIsDragging(dragging)}
              btnText="삭제"
              onDelete={() => handleDeleteClick(alarm.id)}
            >
              <div
                onClick={() => handleAlarmClick(alarm.id, alarm.link)}
                className={`p-box flex h-full min-h-[90px] w-full items-center justify-between py-[13px] ${alarm.isRead ? 'opacity-50' : ''}`}
              >
                <div className="flex-1 py-4 pr-4">
                  <p className="typo-body-regular pb-[3px] text-neutral-900">{alarm.contents}</p>
                  <span className="typo-caption-regular text-neutral-400">{alarm.time}</span>
                </div>

                {alarm.image && alarm.image !== '/alarm_thumb.png' && (
                  <div className="h-[60px] w-[60px] flex-shrink-0">
                    <Image
                      src={alarm.image}
                      alt="알림 이미지"
                      loader={({ src }) => src}
                      unoptimized
                      width={60}
                      height={60}
                      className="h-full w-full rounded-sm object-cover"
                    />
                  </div>
                )}
              </div>
            </SwipeableItem>
            <Line className="z-10" />
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>알림 삭제 확인</DialogTitle>
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

            <Button
              onClick={() => handleConfirmDelete(selectedAlarmId)}
              variant="ghost"
              className="text-danger w-1/2"
            >
              <span>삭제하기</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Alarm;
