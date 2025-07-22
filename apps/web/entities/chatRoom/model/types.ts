export interface ChatRoom {
  chatroom_id: string;
  auction_id: string;
  bid_user_id: string;
  exhibit_user_id: string;
  updated_at: string;
}

export interface ChatRoomWithProfile {
  chatroom_id: string;
  auction_id: {
    min_price: number;
    product_id: {
      title: string;
      product_image: {
        image_url: string;
      }[];
    };
  };
  bid_user_id: {
    user_id: string;
    nickname: string;
    profile_img: string | null;
  };
  exhibit_user_id: {
    user_id: string;
    nickname: string;
    profile_img: string | null;
  };
}

export interface ChatRoomWithMessage extends ChatRoom {
  message: {
    message_id: string;
    chatroom_id: string;
    sender_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
  }[];
}
