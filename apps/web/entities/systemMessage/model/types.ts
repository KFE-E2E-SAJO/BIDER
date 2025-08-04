export interface SystemMessage {
  system_message_id: string;
  chatroom_id: string;
  product_image_url: string;
  bid_user_id: string;
  exhibit_user_id: string;
  created_at: string;
  product_title: string;
  bid_price: number;
}

export interface SystemMessageWithNickname extends SystemMessage {
  bid_user_nickname: string;
  exhibit_user_nickname: string;
}
