'use server';

import { decodeShortId } from '@/shared/lib/shortUuid';
import { supabase } from '@/shared/lib/supabaseClient';
import { AuctionInfoData } from '../types';
import { getYourNickName } from './getYourNickName';

export const getAuctionInfo = async (shortId: string) => {
  const fullChatRoomId = decodeShortId(shortId);

  const { data, error } = await supabase.rpc('get_auction_info', {
    chatroom_id_input: fullChatRoomId,
  });

  if (error) {
    throw new Error(`AuctionInfo 조회 실패: ${error.message}`);
  }

  const yourNickName = await getYourNickName(fullChatRoomId);

  return {
    auctionId: data.auction_id,
    image: data.image,
    title: data.title,
    price: data.price,
    status: data.status,
    yourNickName,
  } as AuctionInfoData;
};
