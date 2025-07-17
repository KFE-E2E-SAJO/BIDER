import { supabase } from '@/shared/lib/supabaseClient';
import { getDistanceKm } from '@/features/product/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import { MapAuction } from '@/entities/auction/model/types';
import { ProductForMapList } from '@/entities/product/model/types';

type MapAuctuionFromDB = MapAuction & {
  product: ProductForMapList;
};

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId || userId === 'undefined') {
    return NextResponse.json(
      { error: '로그인이 필요합니다.', code: 'NO_USER_ID' },
      { status: 401 }
    );
  }

  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('latitude, longitude')
    .eq('user_id', userId)
    .single();

  if (userError || !userData?.latitude || !userData?.longitude) {
    return NextResponse.json(
      { error: '유저 위치 정보가 없습니다.', code: 'NO_USER_LOCATION' },
      { status: 400 }
    );
  }

  const lat = userData.latitude;
  const lng = userData.longitude;

  const { data, error } = await supabase.from('auction').select(`
    auction_id,
    product:product_id (
      latitude,
      longitude,
      product_image (
        image_url,
        order_index
      )
    )
  `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const markers = (data as unknown as MapAuctuionFromDB[])
    .filter((item) => {
      const { product } = item;
      const distance = getDistanceKm(lat, lng, product.latitude, product.longitude);
      return distance <= 5;
    })
    .map((item) => ({
      id: item.auction_id,
      location: { lat: item.product.latitude, lng: item.product.longitude },
      thumbnail:
        item.product.product_image?.find((img) => img.order_index === 0)?.image_url ??
        '/default.png',
    }));

  return NextResponse.json(markers);
}
