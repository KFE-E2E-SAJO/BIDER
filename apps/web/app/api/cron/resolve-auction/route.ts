import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';
import { createPointByReason } from '@/features/point/api/createPointByReason';

export async function GET(request: NextRequest) {
  try {
    // 현재 시간을 기준으로 경매 완료 처리해야 할 auction 조회
    const now = new Date().toISOString();

    const { data: auctions, error: fetchError } = await supabase
      .from('auction')
      .select(
        `
        *,
        product (
          exhibit_user_id
        )
      `
      )
      .lte('auction_end_at', now) // 경매 시간이 지난 것들
      .eq('auction_status', '경매 중');

    if (fetchError) {
      console.error('auction 조회 실패:', fetchError);
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

    // 각 auction에 대해 상태 update (병렬 처리)
    const updateResults = await Promise.allSettled(
      (auctions || []).map(async (auction) => {
        try {
          const { data: bidHistory, error: bidHistoryError } = await supabase
            .from('bid_history')
            .select('*')
            .eq('auction_id', auction.auction_id)
            .order('bid_price', { ascending: false });

          if (bidHistoryError) {
            throw new Error(`bid_history 조회 실패: ${bidHistoryError.message}`);
          }

          if (!bidHistory || bidHistory.length === 0) {
            // 유찰 처리
            const { error } = await supabase
              .from('auction')
              .update({
                auction_status: '경매 종료',
                updated_at: new Date().toISOString(),
              })
              .eq('auction_id', auction.auction_id);

            if (error) {
              throw new Error(`유찰 처리 실패: ${error.message}`);
            }
          } else {
            // 낙찰 처리
            const winning_bid = bidHistory[0];
            const winning_user_id = winning_bid.bid_user_id;

            const { error: auctionUpdateError } = await supabase
              .from('auction')
              .update({
                auction_status: '경매 종료',
                winning_bid_user_id: winning_user_id,
                winning_bid_id: winning_bid.bid_id,
                updated_at: new Date().toISOString(),
              })
              .eq('auction_id', auction.auction_id);

            if (auctionUpdateError) {
              throw new Error(`낙찰자 정보 업데이트 실패: ${auctionUpdateError.message}`);
            }

            const { error: bidHistoryError } = await supabase
              .from('bid_history')
              .update({
                is_awarded: true,
              })
              .eq('bid_id', winning_bid.bid_id);

            if (bidHistoryError) {
              throw new Error(`낙찰 상태 업데이트 실패: ${bidHistoryError.message}`);
            }

            try {
              await createPointByReason('deal_complete_seller', auction.product.exhibit_user_id);
            } catch (error) {
              console.error('출품자 포인트 지급 실패:', error);
            }

            try {
              await createPointByReason(
                'deal_complete_buyer',
                winning_user_id,
                winning_bid.bid_price
              );
            } catch (error) {
              console.error('낙찰자 포인트 지급 실패:', error);
            }
          }

          return { success: true };
        } catch (error) {
          console.error(`Auction ${auction.auction_id} 처리 중 오류:`, error);
          return { success: false };
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
