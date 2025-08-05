import { getChatRoomIdIfExist } from '../api/getChatRoomIdIfExist';
import { createChatRoom } from '../api/createChatRoom';

/*
    사용 가능한 채팅방이 존재할 경우, 해당 채팅방의 shortId 전달
    사용 가능한 채팅방이란 채팅방의 참여자인 두 사람 모두 active 상태인 채팅방이 존재할 경우를 말함
    사용 가능한 채팅방이 존재하지 않을 경우, 새로운 채팅방을 만들어 해당 채팅방의 shortId를 전달
*/
export const getChatRoomLink = async (
  auctionId: string,
  exhibitUserId: string,
  bidUserId: string
) => {
  const existingChatRoom = await getChatRoomIdIfExist(auctionId, exhibitUserId, bidUserId);

  if (existingChatRoom.encodedChatRoomId) {
    return existingChatRoom.encodedChatRoomId;
  } else {
    const newChatRoom = await createChatRoom(auctionId, exhibitUserId, bidUserId);
    return newChatRoom.encodedChatRoomId;
  }
};
