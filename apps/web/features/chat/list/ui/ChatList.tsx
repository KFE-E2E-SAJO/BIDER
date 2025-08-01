import React, { useState } from 'react';
import { ChatListProps } from '../types';
import ChatItem from './ChatItem';
import Link from 'next/link';
import { useChatStore } from '../../room/model/chatStore';
import { useAuthStore } from '@/shared/model/authStore';
import { encodeUUID } from '@/shared/lib/shortUuid';
import SwipeableItem from '@/shared/ui/listItem/SwipeableItem';
import { inactiveChat } from '../api/inactiveChat';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@repo/ui/components/Toast/Sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/Dialog/Dialog';
import { Button } from '@repo/ui/components/Button/Button';

const ChatList = ({ filter, data }: ChatListProps) => {
  const queryClient = useQueryClient();
  const setNickname = useChatStore((s) => s.setNickname);
  const userId = useAuthStore((state) => state.user?.id) as string;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    chatRoom: string;
    exhibitUser: string;
  } | null>(null);

  let filteredData;
  switch (filter) {
    case 'buy':
      filteredData = data.filter((item) => item.bid_user_id === userId);
      break;
    case 'sell':
      filteredData = data.filter((item) => item.exhibit_user_id === userId);
      break;
    case 'unread':
      filteredData = data.filter((item) => item.last_message?.is_read === false);
      break;
    default:
      filteredData = data;
      break;
  }

  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleOpen = (id: string) => {
    // 이미 같은 아이템이 열려있으면 무시
    if (openItemId === id) return;

    // 다른 아이템이 열려있으면 즉시 닫고 새 아이템 열기
    setOpenItemId(id);
  };

  const handleClose = () => {
    setOpenItemId(null);
  };

  const handleLeaveChat = async (chatRoom: string, exhibitUser: string) => {
    try {
      await inactiveChat(chatRoom, exhibitUser);
      await queryClient.invalidateQueries({ queryKey: ['chatList'] }); // ✅ 이거면 됨
      toast({ content: '삭제되었습니다.' });
    } catch (e) {
      console.error(e);
      toast({ content: '채팅방 나가기에 실패했습니다.' });
    }
  };

  return (
    <div className="p-box mt-[21px]">
      {filteredData?.map((chat, index) => (
        <div key={chat.chatroom_id}>
          {index !== 0 && <div className="h-[1px] w-full bg-neutral-100"></div>}
          <SwipeableItem
            isOpen={openItemId === chat.chatroom_id}
            onOpen={() => handleOpen(chat.chatroom_id)}
            onClose={handleClose}
            onDelete={() => {
              setPendingDelete({
                chatRoom: encodeUUID(chat.chatroom_id),
                exhibitUser: encodeUUID(chat.exhibit_user_id),
              });
              setIsDialogOpen(true);
            }}
            onDragChange={(dragging) => setIsDragging(dragging)}
          >
            <Link
              href={`/chat/${encodeUUID(chat.chatroom_id)}`}
              onClick={(e) => {
                if (isDragging) {
                  e.preventDefault(); // 브라우저 기본 이동 차단
                  e.stopPropagation(); // 이벤트 전파 차단 (React 내부)
                  return;
                }

                if (openItemId === chat.chatroom_id) {
                  e.preventDefault(); // 열린 상태일 땐 링크 막고
                  setOpenItemId(null); // 닫기만
                } else {
                  setNickname(chat.your_profile.nickname);
                }
              }}
            >
              <ChatItem onClick={() => setNickname(chat.your_profile.nickname)} data={chat} />
            </Link>
          </SwipeableItem>
        </div>
      ))}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>작업 선택</DialogTitle>
        </DialogHeader>
        <DialogContent showCloseButton={false}>
          <div className="typo-subtitle-small-medium py-[25px] text-center">
            대화 내용이 모두 삭제됩니다
            <br />
            계속하시겠습니까?
          </div>
          <div className="h-[1px] w-full bg-neutral-100"></div>
          <div className="flex items-center justify-center">
            <Button
              onClick={() => setIsDialogOpen(false)}
              variant="ghost"
              className="w-1/2 border-r border-neutral-100"
            >
              <span>취소</span>
            </Button>
            <Button
              onClick={() => {
                if (!pendingDelete) return;

                handleLeaveChat(pendingDelete.chatRoom, pendingDelete.exhibitUser);
                setIsDialogOpen(false);
                setPendingDelete(null);
              }}
              variant="ghost"
              className="text-danger w-1/2"
            >
              <span>삭제하기</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatList;
