import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    // 현재 시간 - 1시간을 기준으로 '경매 중'으로 변경해야 할 auction 조회
    const now = new Date().toISOString();
    const referenceTime = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: auctions, error: fetchError } = await supabase
      .from('auction')
      .select('auction_id, product_id')
      .eq('auction_status', '경매 대기')
      .lte('created_at', referenceTime);

    if (fetchError) {
      console.error('auctions 조회 실패:', fetchError);
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
    }

    if (!auctions || auctions.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        successCount: 0,
        failCount: 0,
        timestamp: now,
        message: '처리할 경매가 없습니다.',
      });
    }

    // 각 auction의 auction_status를 '경매 중'으로 변경
    const updateResults = await Promise.allSettled(
      auctions.map(async (auction) => {
        try {
          const { error: updateError } = await supabase
            .from('auction')
            .update({
              auction_status: '경매 중',
              updated_at: now,
            })
            .eq('auction_id', auction.auction_id);

          if (updateError) {
            throw new Error(`Auction ${auction.auction_id} 업데이트 실패: ${updateError.message}`);
          }

          return {
            success: true,
            auction_id: auction.auction_id,
            product_id: auction.product_id,
          };
        } catch (error) {
          console.error(`Product ${auction.product_id} 처리 중 오류:`, error);
          return {
            success: false,
            auction_id: auction.auction_id,
            product_id: auction.product_id,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    // 결과 요약
    const successCount = updateResults.filter(
      (result) => result.status === 'fulfilled' && result.value.success
    ).length;

    const failCount = updateResults.length - successCount;

    const result = {
      success: true,
      processed: auctions?.length || 0,
      successCount,
      failCount,
      timestamp: now,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Cron job 실행 중 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
