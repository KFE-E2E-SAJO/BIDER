import { MessageWithProfile } from '@/entities/message/model/types';

// Supabase 실시간 페이로드 타입 정의
export interface RealtimeMessagePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';
  schema: string;
  table: string;
  commitTimestamp: string;
  old: MessageWithProfile | null; // DELETE, UPDATE 시 이전 데이터
  new: MessageWithProfile | null; // INSERT, UPDATE 시 새 데이터
  errors: string[];
}
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
  auctionId: string;
  image: string;
  title: string;
  price: number;
  status: string;
  yourNickName: string;
  exhibitUserId: string;
  bidUserId: string;
}
