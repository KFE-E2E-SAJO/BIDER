import { decodeShortId } from '@/shared/lib/shortUuid';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import { AuctionDetail, AuctionForBid } from '@/entities/auction/model/types';

export async function GET(_req: Request, { params }: { params: Promise<{ shortId: string }> }) {
  const resolvedParams = await params;
  const id = decodeShortId(resolvedParams.shortId);

  try {
    // 병렬로 데이터 조회
    const [auctionResult, bidHistoryResult, currentHighestBidResult] = await Promise.all([
      supabase
        .from('auction')
        .select(
          `
          *,
          product (
            *,
            exhibit_user:exhibit_user_id (*), 
            product_image (*)
          )
        `
        )
        .eq('auction_id', id)
        .single(),

      supabase
        .from('bid_history')
        .select(
          `
          *,
          bid_user_nickname:bid_user_id (nickname)
        `
        )
        .eq('auction_id', id)
        .order('bid_price', { ascending: false })
        .limit(5),

      supabase.rpc('get_current_highest_bid', { auction_uuid: id }),
    ]);

    const { data: auctionData, error: auctionError } = auctionResult;
    const { data: bidHistory, error: bidError } = bidHistoryResult;
    const { data: currentHighestBid, error: bidPriceError } = currentHighestBidResult;

    if (auctionError || !auctionData) {
      return NextResponse.json({ error: '경매 조회 실패' }, { status: 500 });
    }

    if (bidError || bidPriceError) {
      return NextResponse.json({ error: '입찰 정보 조회 실패' }, { status: 500 });
    }

    const productData = auctionData.product;
    const userData = productData?.exhibit_user;

    // 응답 데이터 구성
    const response: AuctionDetail = {
      ...auctionData,
      product: {
        ...productData,
        exhibit_user: userData,
        product_image: productData?.product_image || [],
      },
      bid_history: bidHistory || [],
      current_highest_bid: currentHighestBid || auctionData.min_price,
    } as AuctionDetail;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching auction data:', error);
    return NextResponse.json({ error: '경매 정보 조회 실패' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const shortId = url.pathname.split('/').pop();
    const auctionId = decodeShortId(shortId!);

    // 요청 본문에서 입찰 데이터 추출
    const { bidPrice, userId } = await req.json();

    // 0. 회원 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId);

    if (userError || !userData) {
      return NextResponse.json({ error: '회원 정보 조회 실패' }, { status: 500 });
    }

    // 1. 입찰가 유효성 검증
    if (!bidPrice || bidPrice <= 0) {
      return NextResponse.json({ error: '올바른 입찰가를 입력해주세요.' }, { status: 400 });
    }

    // 2. 경매 정보 조회
    const { data: auctionData, error: auctionError } = await supabase
      .from('auction')
      .select('auction_end_at, auction_status, min_price, product:product_id(title)')
      .eq('auction_id', auctionId)
      .single();

    if (auctionError || !auctionData) {
      return NextResponse.json({ error: '경매를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 3. 경매 마감 시간 확인
    const now = new Date();
    const auctionEndTime = new Date(auctionData.auction_end_at);

    if (now >= auctionEndTime) {
      return NextResponse.json({ error: '경매가 이미 마감되었습니다.' }, { status: 400 });
    }

    // 4. 경매 상태 확인
    if (auctionData.auction_status !== '경매 중') {
      return NextResponse.json({ error: '현재 입찰할 수 없는 경매입니다.' }, { status: 400 });
    }

    // 5. 현재 최고 입찰가 확인
    const { data: currentHighestBid } = await supabase
      .from('bid_history')
      .select('bid_price')
      .eq('auction_id', auctionId)
      .order('bid_price', { ascending: false })
      .limit(1)
      .single();

    const minRequiredBid = currentHighestBid?.bid_price
      ? currentHighestBid.bid_price
      : auctionData.min_price;

    if (bidPrice <= minRequiredBid) {
      return NextResponse.json(
        {
          error: `최소 입찰가는 ${minRequiredBid.toLocaleString()}원 초과입니다.`,
          minRequiredBid,
        },
        { status: 400 }
      );
    }

    // 6. 입찰 데이터 삽입
    const { data: bidData, error: bidError } = await supabase
      .from('bid_history')
      .insert([
        {
          auction_id: auctionId,
          bid_user_id: userId,
          bid_price: bidPrice,
        },
      ])
      .select()
      .single();

    if (bidError) {
      console.error('입찰 삽입 오류:', bidError);
      return NextResponse.json({ error: '입찰 처리 중 오류가 발생했습니다.' }, { status: 500 });
    }

    const auctionTyped = auctionData as unknown as AuctionForBid;
    const productTitle = auctionTyped.product.title;

    // 8. 성공 응답
    return NextResponse.json({
      success: true,
      message: '입찰이 완료되었습니다!',
      bidData: {
        bid_id: bidData.bid_id,
        bid_price: bidData.bid_price,
        bid_at: bidData.bid_at,
        product_title: productTitle,
        bid_end_at: auctionData.auction_end_at,
      },
    });
  } catch (error) {
    console.error('입찰 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
