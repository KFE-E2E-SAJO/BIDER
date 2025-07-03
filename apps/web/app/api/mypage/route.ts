import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const userId = formData.get('userId') as string;
  const nickname = formData.get('nickname') as string;
  const isDeleted = formData.get('isDeleted') === 'true';
  const profileImg = formData.get('profileImg') as string | null;

  if (!userId || !nickname) {
    return NextResponse.json({ error: '유저 정보가 부족합니다.' }, { status: 400 });
  }

  const profileImgToSave = isDeleted ? null : profileImg;

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      nickname,
      profile_img: profileImgToSave,
    })
    .eq('user_id', userId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, nickname, profile_img')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: '프로필 정보를 불러오지 못했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
