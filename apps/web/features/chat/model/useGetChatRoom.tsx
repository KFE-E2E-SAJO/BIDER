import { useQuery } from '@tanstack/react-query';
import { ChatRoom } from '@/entities/chatRoom/model/types';
import { useAuthStore } from '@/shared/model/authStore';
import { getChatRoom } from '../api/getChatRoom';

export const useGetChatRoom = (content: string, chatroomId: string) => {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery<ChatRoom[] | null>({
    queryKey: ['getChatRoom', content, userId, chatroomId],
    queryFn: () => getChatRoom(chatroomId),
    enabled: !!chatroomId,
  });
};
