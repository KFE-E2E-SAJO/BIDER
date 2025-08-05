import { Profiles } from '@/entities/profiles/model/types';

export interface Message {
  message_id: string;
  chatroom_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface MessageWithProfile extends Message {
  profile?: Profiles;
}
