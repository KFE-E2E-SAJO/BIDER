import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { productId } = await request.json();

  const { error } = await supabase.from('product').delete().eq('product_id', productId);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { success: false, message: '로그인 후 서비스 이용이 가능합니다' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('product')
    .select(
      `
    *,
    product_image:product_image!product_image_product_id_fkey(*),
    auction:auction!auction_product_id_fkey(
      *,
      bid_history:BidHistory_auction_id_fkey(*)
    )
  `
    )
    .order('created_at', { ascending: false });
  if (error || !data) {
    return NextResponse.json(
      { success: false, message: '출품 데이터 로딩 실패', error },
      { status: 500 }
    );
  }

  const filtered = data.filter((product) => product.exhibit_user_id === userId);

  return NextResponse.json({ success: true, data: filtered });
}
