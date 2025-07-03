import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';
import { searcher } from '@/features/search/lib/utils';
import { getDistanceKm } from '@/features/product/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const minPrice = parseInt(formData.get('min_price') as string, 10);
    const endAt = formData.get('end_at') as string;
    const exhibitUserId = formData.get('user_id') as string;

    // STEP 0: 로그인한 회원 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', exhibitUserId);

    if (userError || !userData) {
      return NextResponse.json({ error: '회원 정보 조회 실패' }, { status: 500 });
    }

    const user = userData?.[0];
    const latitude = user.latitude;
    const longitude = user.longitude;
    const address = user.address;

    const uploadedImageUrls: string[] = [];

    // STEP 1: 이미지 업로드 → 실패 시 abort
    for (const [index, file] of files.entries()) {
      const ext = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${ext}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-image')
        .upload(filePath, file, { contentType: file.type });

      if (uploadError) {
        return NextResponse.json(
          { error: `이미지 업로드 실패: ${uploadError.message}` },
          { status: 500 }
        );
      }

      const { data: urlData } = supabase.storage.from('product-image').getPublicUrl(filePath);

      uploadedImageUrls.push(urlData.publicUrl);
    }

    // STEP 2: product 등록 (이미지 업로드 성공 이후)
    const { data: productData, error: productError } = await supabase
      .from('product')
      .insert({
        title,
        description,
        exhibit_user_id: exhibitUserId,
        created_at: new Date().toISOString(),
        latitude,
        longitude,
        category,
        address,
      })
      .select('product_id')
      .single();

    if (productError || !productData) {
      return NextResponse.json({ error: '상품 등록 실패' }, { status: 500 });
    }

    const productId = productData.product_id;

    // STEP 3: product_image 테이블에 이미지 URL insert
    for (const [index, url] of uploadedImageUrls.entries()) {
      const { error: imageInsertError } = await supabase.from('product_image').insert({
        product_id: productId,
        image_url: url,
        order_index: index,
      });

      if (imageInsertError) {
        return NextResponse.json({ error: '이미지 메타데이터 저장 실패' }, { status: 500 });
      }
    }

    // STEP 4: 1시간 뒤 auction 자동 생성 예약 호출
    const auctionCreateTime = new Date(Date.now() + 60 * 60 * 1000); // 1시간 후

    const { error: pendingError } = await supabase.from('pending_auction').insert({
      product_id: productId,
      min_price: minPrice,
      auction_end_at: endAt,
      scheduled_create_at: auctionCreateTime.toISOString(),
      auction_status: '경매 대기',
    });

    if (pendingError) {
      console.error('예약 경매 저장 실패:', pendingError);
    }

    return NextResponse.json({ success: true, product_id: productId });
  } catch (err) {
    console.error('서버 오류:', err);
    return NextResponse.json({ error: '서버 내부 오류 발생' }, { status: 500 });
  }
}

export interface Auction {
  auction_id: string;
  product: {
    title: string;
    description: string;
    category: string | null;
    exhibit_user: {
      user_id: string;
      address: string;
      profile_img: string | null;
      nickname: string;
    };
    product_image: ProductImage[];
  };
  auction_status: string;
  min_price: number;
  auction_end_at: string;
  bid_history: {
    bid_id: string;
    bid_price: number;
    bid_user_id: string;
    bid_at: string;
  }[];
  current_highest_bid?: number; // 현재 최고 입찰가 (옵션)
}

export interface ProductImage {
  image_id: string;
  image_url: string;
  order_index: number;
  product_id: string;
}

interface ProductFromDB {
  auction_id: string;
  product_id: string;
  product: {
    title: string;
    category: string | null; // 카테고리 추후 수정
    exhibit_user_id: string;
    product_image: {
      image_url: string;
      order_index: number;
    }[];
    latitude: number;
    longitude: number;
    address: string;
  };
  auction_status: string;
  min_price: number;
  auction_end_at: string;
  bid_history: {
    bid_id: string;
  }[];
}

interface ProductResponse {
  id: string;
  thumbnail: string;
  title: string;
  address: string;
  bidCount: number;
  minPrice: number;
  auctionEndAt: string;
  auctionStatus: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get('userId');
  const search = searchParams.get('search')?.toLowerCase() || '';
  const cate = searchParams.get('cate') || '';

  if (!userId) {
    return NextResponse.json({ error: 'userId가 없습니다' }, { status: 400 });
  }

  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('latitude, longitude')
    .eq('user_id', userId)
    .single();

  if (!userData?.latitude || !userData?.longitude) {
    return NextResponse.json({ error: '유저 위치 정보가 없습니다.' }, { status: 400 });
  }

  if (userError) {
    return NextResponse.json({ error: '유저 정보 조회 실패' }, { status: 500 });
  }

  const lat = userData.latitude;
  const lng = userData.longitude;

  const { data: auctionData, error } = await supabase.from('auction').select(`
  auction_id,
  product_id,
  auction_status,
  min_price,
  auction_end_at,
  product:product_id (
    title,
    category,
    latitude,
    longitude,
    exhibit_user_id,
    product_image (
      image_url,
      order_index
    ),
    address
  ),
  bid_history!auction_id (
    bid_id
  )
`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const filtered: ProductResponse[] = (auctionData as unknown as ProductFromDB[])
    .filter((item) => {
      const { product } = item;
      const distance = getDistanceKm(lat, lng, product.latitude, product.longitude);
      const within5km = distance <= 5;
      const matchSearch = !search || searcher(product.title, search);
      const matchCate = cate === '' || cate === 'all' || product.category === cate;
      return within5km && matchSearch && matchCate;
    })
    .map((item) => ({
      id: item.auction_id,
      thumbnail:
        item.product.product_image?.find((img) => img.order_index === 0)?.image_url ??
        '/default.png',
      title: item.product.title,
      address: item.product.address,
      bidCount: item.bid_history?.length ?? 0,
      minPrice: item.min_price,
      auctionEndAt: item.auction_end_at,
      auctionStatus: item.auction_status,
    }));

  return NextResponse.json(filtered);
}
