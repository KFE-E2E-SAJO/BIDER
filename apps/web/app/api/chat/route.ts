import { ChatRoomForList } from '@/entities/chatRoom/model/types';
import { Message } from '@/entities/message/model/types';
import { ProductImage } from '@/entities/productImage/model/types';
import { Profiles } from '@/entities/profiles/model/types';
import { decodeShortId } from '@/shared/lib/shortUuid';
import { createClient } from '@/shared/lib/supabase/server';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

type RawRow = Omit<
  ChatRoomForList,
  'last_message' | 'your_profile' | 'product_image' | 'unread_count' | 'is_win'
> & {
  last_message: Message | null;
  your_profile: Profiles | null;
  product_image: ProductImage | null;
  unread_count: number | null;
  is_win: boolean;
};

export async function GET(_req: Request) {
  const authSupabase = await createClient();

  const {
    data: { session },
  } = await authSupabase.auth.getSession();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

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
    is_win: row.is_win as boolean,
  }));

  return NextResponse.json(chatRooms);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { chatRoom, exhibitUser } = body;

  const chatRoomId = decodeShortId(chatRoom);
  const exhibitUserId = decodeShortId(exhibitUser);

  const authSupabase = await createClient();

  const {
    data: { session },
  } = await authSupabase.auth.getSession();
  const userId = session?.user.id;

  if (exhibitUserId === userId) {
    const { error } = await supabase
      .from('chat_room')
      .update({ exhibit_user_active: false })
      .eq('chatroom_id', chatRoomId);

    if (error) {
      console.error(error.message);
      return NextResponse.json(
        { success: false, message: '채팅 inactive 실패', error },
        { status: 500 }
      );
    }
  } else {
    const { error } = await supabase
      .from('chat_room')
      .update({ bid_user_active: false })
      .eq('chatroom_id', chatRoomId);

    if (error) {
      console.error(error.message);
      return NextResponse.json(
        { success: false, message: '채팅 inactive 실패', error },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ success: true, message: '채팅 inactive 처리 완료' });
}
