import { ChatRoom } from '@/entities/chatRoom/model/types';

export interface ChatListProps {
  filter: 'all' | 'buy' | 'sell' | 'unread';
  data: ChatRoom[];
}

export interface ChatItemProps {
  onClick?: () => void;
}
