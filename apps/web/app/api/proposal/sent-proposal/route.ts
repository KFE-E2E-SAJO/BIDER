import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import getUserId from '@/shared/lib/getUserId';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: '로그인 후 서비스 이용이 가능합니다' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('proposal')
      .select(
        `
        *,
        auction:proposal_auction_id_fkey(
          auction_id,
          product:product_id(
            product_id,
            title,
            product_image:product_image!product_image_product_id_fkey(image_url),
              exhibit_user_id
            )
          ),
        proposer_id:proposal_proposer_id_fkey(nickname, profile_img, user_id)    
      `
      )
      .eq('proposer_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      throw new Error(`보낸 제안 조회 실패 : ${error.message}`);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('조낸 제안 조회 에러:', error);
    return NextResponse.json(
      { success: false, message: '데이터 로딩 실패', error },
      { status: 500 }
    );
  }
}
