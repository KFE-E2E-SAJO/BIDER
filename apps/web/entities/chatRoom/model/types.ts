import { Message } from '@/entities/message/model/types';
import { ProductImage } from '@/entities/productImage/model/types';
import { Profiles } from '@/entities/profiles/model/types';

export interface ChatRoom {
  chatroom_id: string;
  auction_id: string;
  bid_user_id: string;
  exhibit_user_id: string;
  created_at: string;
  bid_user_active: boolean;
  exhibit_user_active: boolean;
}

export interface ChatRoomForList extends ChatRoom {
  product_image: ProductImage;
  your_profile: Profiles;
  last_message: Message | null;
  unread_count: number;
  isWin: boolean;
}
