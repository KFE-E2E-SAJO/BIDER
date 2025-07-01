import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    // 현재 시간을 기준으로 경매 완료 처리해야 할 auction 조회
    const now = new Date().toISOString();

    const { data: auctions, error: fetchError } = await supabase
      .from('auction')
      .select('*')
      .lte('auction_end_at', now); // 경매 시간이 지난 것들

    if (fetchError) {
      console.error('auction 조회 실패:', fetchError);
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
    }

    let successCount = 0;
    let failCount = 0;

    // 각 auction에 대해 상태 update
    for (const auction of auctions || []) {
      try {
        const { data: bidHistory, error: bidHistoryError } = await supabase
          .from('bid_history')
          .select('*')
          .eq('auction_id', auction.auction_id)
          .order('bid_price', { ascending: false });

        if (bidHistoryError) {
          return NextResponse.json(
            {
              success: false,
              error: bidHistoryError instanceof Error ? bidHistoryError.message : 'Unknown error',
              timestamp: new Date().toISOString(),
            },
            { status: 500 }
          );
        } else if (!bidHistory || bidHistory.length === 0) {
          const { error } = await supabase
            .from('auction')
            .update({
              auction_status: '경매 종료',
              updated_at: new Date().toISOString(),
            })
            .eq('auction_id', auction.auction_id);
          if (error) {
            console.error('경매 상태 업데이트 실패 (유찰 처리):', error);
          } else {
            console.log('유찰 처리 완료');
          }
        } else {
          const { error: auctionUpdateError } = await supabase
            .from('auction')
            .update({
              auction_status: '경매 종료',
              winning_bid_user_id: bidHistory[0].bid_user_id,
              winning_bid_id: bidHistory[0].bid_id,
              updated_at: new Date().toISOString(),
            })
            .eq('auction_id', auction.auction_id);

          if (auctionUpdateError) {
            console.error('낙찰자 정보 업데이트 실패:', auctionUpdateError);
            failCount++;
            return;
          }

          const { error: bidHistoryError } = await supabase
            .from('bid_history')
            .update({
              is_awarded: true,
            })
            .eq('bid_id', bidHistory[0].bid_id);

          if (bidHistoryError) {
            console.error('낙찰 상태 업데이트 실패 (bid_history):', bidHistoryError);
            failCount++;
          } else {
            console.log('낙찰 처리 완료');
          }
        }
        successCount++;
      } catch (error) {
        console.error(`Product ${auction.auction_id} 처리 중 오류:`, error);
        failCount++;
      }
    }

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
