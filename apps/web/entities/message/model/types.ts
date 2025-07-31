export interface Message {
  message_id: string;
  chatroom_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}
