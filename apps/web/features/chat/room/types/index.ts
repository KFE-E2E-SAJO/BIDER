import { MessageWithProfile } from '@/entities/message/model/types';

export interface MessageProps {
  text: string;
  showTime: boolean;
  isRead?: boolean;
  showAvatar?: boolean;
  isLast?: boolean;
  className?: string;
  time: string;
  avatar?: string;
}

export interface AuctionInfoData {
  image: string;
  title: string;
  price: number;
  status: string;
  yourNickName: string;
}
