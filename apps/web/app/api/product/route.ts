import { getDistanceKm } from '@/features/Product/lib/utils';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

interface ProductFromDB {
  product: {
    title: string;
    category: string | null; // 카테고리 추후 수정
    exhibit_user_id: string;
    product_image: {
      image_url: string;
      order_index: number;
    }[];
    user: {
      address: string;
      latitude: number;
      longitude: number;
    };
  };
  auction_status: string;
  min_price: number;
  auction_end_at: string;
  bid_history: {
    bid_id: string;
  }[];
}

interface ProductResponse {
  thumbnail: string;
  title: string;
  location: string;
  bidCount: number;
  minPrice: number;
  auctionEndAt: string;
  auctionStatus: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const search = searchParams.get('search')?.toLowerCase() || '';
  const cate = searchParams.get('cate') || '';

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Missing lat/lng' }, { status: 400 });
  }

  const { data, error } = await supabase.from('auction').select(`
  auction_status,
  min_price,
  auction_end_at,
  product:product_id (
    title,
    category,
    exhibit_user_id,
    product_image (
      image_url,
      order_index
    ),
    user:exhibit_user_id (
      address,
      latitude,
      longitude
    )
  ),
  bid_history!auction_id (
    bid_id
  )
`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const filtered: ProductResponse[] = (data as unknown as ProductFromDB[])
    .filter((item) => {
      const { product } = item;
      const user = product?.user;
      if (!user?.latitude || !user?.longitude) return false;

      const distance = getDistanceKm(lat, lng, user.latitude, user.longitude);
      const within5km = distance <= 5;
      console.log('거리:', distance, '위치:', lat, lng, 'vs', user.latitude, user.longitude);

      const matchSearch = !search || product.title.toLowerCase().includes(search);
      const matchCate = !cate || product.category === cate;

      return within5km && matchSearch && matchCate;
    })
    .map((item) => ({
      thumbnail:
        item.product.product_image?.find((img) => img.order_index === 0)?.image_url ??
        '/default.png',
      title: item.product.title,
      location: item.product.user.address,
      bidCount: item.bid_history?.length ?? 0,
      minPrice: item.min_price,
      auctionEndAt: item.auction_end_at,
      auctionStatus: item.auction_status,
    }));

  return NextResponse.json(filtered);
}
