import { useQuery } from '@tanstack/react-query';
import { ChatRoom } from '@/entities/chatRoom/model/types';
import { getChatList } from '../api/getChatList';

export const useGetChatList = (userId: string) => {
  return useQuery<ChatRoom[]>({
    queryKey: ['chat_room', userId],
    queryFn: () => getChatList(userId),
    enabled: !!userId,
  });
};
