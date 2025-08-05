import { ChatRoomForList } from '@/entities/chatRoom/model/types';
import { useQuery } from '@tanstack/react-query';
import { getChatList } from '../api/getChatList';

export const useChatList = () => {
  return useQuery<ChatRoomForList[] | []>({
    queryKey: ['chatList'],
    queryFn: () => getChatList(),
    staleTime: 1000 * 60 * 1,
  });
};
