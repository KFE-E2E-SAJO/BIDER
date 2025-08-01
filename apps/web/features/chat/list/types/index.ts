import { ChatRoomForList } from '@/entities/chatRoom/model/types';

export interface ChatListProps {
  filter: 'all' | 'buy' | 'sell' | 'unread';
  data: ChatRoomForList[];
}

export interface ChatItemProps {
  onClick?: () => void;
  data: ChatRoomForList;
}
