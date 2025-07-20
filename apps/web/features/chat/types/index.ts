import { Message } from '@/entities/message/model/types';

export interface ChatroomWithInfo {
  chatroomId: string;
  updatedAt: string;
  auctionId: {
    minPrice: number;
    productId: {
      Title: string;
      productImage: {
        imageUrl: string;
      }[];
    };
  };
  bidUserId: {
    userId: string;
    nickName: string;
    profileImg: string | null;
  };
  exhibitUserId: {
    userId: string;
    nickName: string;
    profileImg: string | null;
  };
  messages: Message[];
}

export type ChatroomWithInfoProps = {
  data: ChatroomWithInfo;
  userId: string;
};
