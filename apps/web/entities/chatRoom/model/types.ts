import { Message } from '@/entities/message/model/types';

export interface ChatRoom {
  chatroom_id: string;
  auction_id: string;
  bid_user_id: string;
  exhibit_user_id: string;
  updated_at: string;
}

export interface ChatRoomWithProfile extends ChatRoom {
  auction: {
    min_price: number;
    product: {
      title: string;
      product_image: {
        image_url: string;
      };
    };
  };
  profiles: {
    user_id: string;
    nickname: string;
    profile_img: string | null;
  };
}

export interface ChatRoomWithMessage extends ChatRoom {
  message: Message[];
}
