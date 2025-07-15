import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';
import { searcher } from '@/features/search/lib/utils';
import { getDistanceKm } from '@/features/product/lib/utils';
import { AuctionForList } from '@/entities/auction/model/types';
import { ProductForList } from '@/entities/product/model/types';
import { BidHistory } from '@/entities/bidHistory/model/types';

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

    // STEP 4: auction 테이블에 insert
    const { error: auctionError } = await supabase.from('auction').insert({
      product_id: productId,
      min_price: minPrice,
      auction_end_at: endAt,
      auction_status: '경매 대기',
    });

    if (auctionError) {
      console.error('경매 저장 실패:', auctionError);
    }

    return NextResponse.json({ success: true, product_id: productId });
  } catch (err) {
    console.error('서버 오류:', err);
    return NextResponse.json({ error: '서버 내부 오류 발생' }, { status: 500 });
  }
}

//나중에 auction으로 이사 시킬껍니다!
type AuctionListFromDB = AuctionForList & {
  product: ProductForList;
  bid_history: Pick<BidHistory, 'bid_price'>[];
};

interface AuctionResponse {
  data: {
    id: string;
    thumbnail: string;
    title: string;
    address: string;
    bidCount: number;
    minPrice: number;
    auctionEndAt: string;
    auctionStatus: string;
  }[];
  nextOffset: number | null;
}

interface ErrorResponse {
  error: string;
  code?: string;
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<AuctionResponse | ErrorResponse>> {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get('userId');
  const search = searchParams.get('search')?.toLowerCase() || '';
  const cate = searchParams.get('cate') || '';
  const sort = searchParams.get('sort') || 'latest';

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

  if (!userData?.latitude || !userData?.longitude) {
    return NextResponse.json(
      { error: '유저 위치 정보가 없습니다.', code: 'NO_USER_LOCATION' },
      { status: 400 }
    );
  }

  if (userError) {
    return NextResponse.json(
      { error: '유저 정보 조회 실패', code: 'USER_FETCH_FAIL' },
      { status: 500 }
    );
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
    bid_price
  )
`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const filtered = (auctionData as unknown as AuctionListFromDB[])
    .filter((item) => {
      const { product } = item;
      const distance = getDistanceKm(lat, lng, product.latitude, product.longitude);
      const within5km = distance <= 5;
      const matchSearch = !search || searcher(product.title, search);
      const matchCate = cate === '' || cate === 'all' || product.category === cate;
      return within5km && matchSearch && matchCate;
    })
    .map((item) => {
      const bidPrices = item.bid_history?.map((b) => b.bid_price) ?? [];
      const highestBid = bidPrices.length > 0 ? Math.max(...bidPrices) : null;
      return {
        id: item.auction_id,
        thumbnail:
          item.product.product_image?.find((img) => img.order_index === 0)?.image_url ??
          '/default.png',
        title: item.product.title,
        address: item.product.address,
        bidCount: item.bid_history?.length ?? 0,
        minPrice: highestBid ?? item.min_price,
        auctionEndAt: item.auction_end_at,
        auctionStatus: item.auction_status,
      };
    });

  const limit = Number(searchParams.get('limit')) || 10;
  const offset = Number(searchParams.get('offset')) || 0;

  const sorted = filtered.sort((a, b) => {
    if (sort === 'popular') {
      return b.bidCount - a.bidCount;
    } else {
      return new Date(b.auctionEndAt).getTime() - new Date(a.auctionEndAt).getTime();
    }
  });

  const sliced = sorted.slice(offset * limit, (offset + 1) * limit);

  return NextResponse.json({
    data: sliced,
    nextOffset: sliced.length < limit ? null : offset + 1,
  });
}
