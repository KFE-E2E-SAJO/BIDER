import { useQuery } from '@tanstack/react-query';
import {
  ChatRoom,
  ChatRoomWithProfile,
  ChatRoomWithMessage,
} from '@/entities/chatRoom/model/types';
import { useAuthStore } from '@/shared/model/authStore';
import { getChatRoom } from '../api/getChatRoom';

export const useGetChatRoom = ({ userId, roomId }: { userId: string; roomId: string }) => {
  return useQuery<ChatRoomWithProfile[] | ChatRoom[] | ChatRoomWithMessage[] | null>({
    queryKey: ['getChatRoom', userId, roomId],
    queryFn: () => getChatRoom(roomId, userId!),
    enabled: !!userId && !!roomId,
  });
};
