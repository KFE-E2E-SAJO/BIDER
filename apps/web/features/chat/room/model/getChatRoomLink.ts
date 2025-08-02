import { encodeUUID } from '@/shared/lib/shortUuid';
import { getChatRoomIdIfExist } from '../api/getChatRoomIdIfExist';
import { createChatRoom } from '../api/createChatRoom';

export const getChatRoomLink = async (
  auctionId: string,
  exhibitUserId: string,
  bidUserId: string
) => {
  const existingChatRoom = await getChatRoomIdIfExist(auctionId, exhibitUserId, bidUserId);

  if (existingChatRoom.data) {
    return encodeUUID(existingChatRoom.data.chatroom_id);
  } else {
    const newChatRoom = await createChatRoom(auctionId, exhibitUserId, bidUserId);
    return encodeUUID(newChatRoom.data.chatroom_id);
  }
};
