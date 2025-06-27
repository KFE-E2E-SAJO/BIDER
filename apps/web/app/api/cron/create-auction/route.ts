import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    // 현재 시간을 기준으로 생성해야 할 pending_auction 조회
    const now = new Date().toISOString();

    const { data: pendingAuctions, error: fetchError } = await supabase
      .from('pending_auction')
      .select('*')
      .eq('auction_status', '경매 대기')
      .lte('scheduled_create_at', now); // 예정 시간이 지난 것들

    if (fetchError) {
      console.error('Pending auctions 조회 실패:', fetchError);
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
    }

    let successCount = 0;
    let failCount = 0;

    // 각 pending auction에 대해 실제 auction 생성
    for (const pending of pendingAuctions || []) {
      try {
        // auction 테이블에 데이터 생성
        const { error: createError } = await supabase.from('auction').insert({
          product_id: pending.product_id,
          min_price: pending.min_price,
          auction_end_at: pending.auction_end_at,
          created_at: new Date().toISOString(),
          auction_status: '경매 중',
        });

        if (createError) {
          console.error(`Product ${pending.product_id} 경매 생성 실패:`, createError);
          failCount++;
          continue;
        }

        // pending_auction 데이터 삭제
        const { error: deleteError } = await supabase
          .from('pending_auction')
          .delete()
          .eq('pending_auction_id', pending.pending_auction_id);

        if (deleteError) {
          console.error(`Pending auction ${pending.pending_auction_id} 삭제 실패:`, deleteError);
        }

        successCount++;
      } catch (error) {
        console.error(`Product ${pending.product_id} 처리 중 오류:`, error);
        failCount++;
      }
    }

    const result = {
      success: true,
      processed: pendingAuctions?.length || 0,
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
