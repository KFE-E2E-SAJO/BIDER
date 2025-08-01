import { ChatRoomForList } from '@/entities/chatRoom/model/types';
import { Message } from '@/entities/message/model/types';
import { ProductImage } from '@/entities/productImage/model/types';
import { Profiles } from '@/entities/profiles/model/types';
import { createClient } from '@/shared/lib/supabase/server';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextResponse } from 'next/server';

type RawRow = Omit<ChatRoomForList, 'last_message'> & {
  last_message: any;
};

export async function GET(_req: Request) {
  const authSupabase = await createClient();

  const {
    data: { session },
  } = await authSupabase.auth.getSession();
  const userId = session?.user.id;

  const { data, error } = await supabase.rpc('get_chatrooms_with_profile_and_last_message', {
    user_uuid: userId,
  });

  if (error) {
    console.error(error.message);
    return NextResponse.json(
      { success: false, message: '채팅 리스트 조회 실패', error },
      { status: 500 }
    );
  }

  const chatRooms: ChatRoomForList[] = (data as RawRow[]).map((row) => ({
    ...row,
    last_message: row.last_message as Message | null,
    your_profile: row.your_profile as Profiles,
    product_image: row.product_image as ProductImage,
    unread_count: (row.unread_count as number) ?? 0,
    isWin: row.isWin as boolean,
  }));

  return NextResponse.json(chatRooms);
}
