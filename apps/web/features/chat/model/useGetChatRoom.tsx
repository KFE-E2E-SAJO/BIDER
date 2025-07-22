import { useQuery } from '@tanstack/react-query';
import {
  ChatRoom,
  ChatRoomWithProfile,
  ChatRoomWithMessage,
} from '@/entities/chatRoom/model/types';
import { useAuthStore } from '@/shared/model/authStore';
import { getChatRoom } from '../api/getChatRoom';

export const useGetChatRoom = ({ userId, chatroomId }: { userId: string; chatroomId: string }) => {
  return useQuery<ChatRoomWithProfile[] | ChatRoom[] | ChatRoomWithMessage[] | null>({
    queryKey: ['getChatRoom', userId, chatroomId],
    queryFn: () => getChatRoom(chatroomId, userId!),
    enabled: !!userId && !!chatroomId,
  });
};
