import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('bid_history')
    .select(
      `
    *,
    auction:auction_id(
      *,
      product:product_id(
        *,
        product_image:product_image!product_image_product_id_fkey(*)
      )
    )
  `
    )
    .eq('bid_user_id', userId);

  if (error || !data) {
    console.error('출품 데이터 로딩 실패:', error);
    return NextResponse.json(
      { success: false, message: '데이터 로딩 실패', error },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
}
