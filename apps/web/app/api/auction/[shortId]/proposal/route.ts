import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';
import { PROPOSAL_COST } from '@/shared/consts/pointConstants';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const auctionId = formData.get('auctionId') as string;
    const proposedPrice = parseInt(formData.get('proposedPrice') as string, 10);

    if (!userId || !auctionId || isNaN(proposedPrice)) {
      return NextResponse.json({ error: '입력값이 유효하지 않습니다.' }, { status: 400 });
    }

    // 제안 등록
    const { error: proposalError } = await supabase.from('proposal').insert({
      proposal_id: uuidv4(),
      auction_id: auctionId,
      proposer_id: userId,
      proposed_price: proposedPrice,
      proposal_status: 'pending',
    });

    if (proposalError) {
      return NextResponse.json({ error: '제안 등록 실패' }, { status: 500 });
    }

    // 유저 포인트 확인
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('point')
      .eq('user_id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: '포인트 정보를 가져올 수 없습니다.' }, { status: 403 });
    }

    // 포인트 차감
    const { error: deductError } = await supabase
      .from('profiles')
      .update({ point: userData.point - PROPOSAL_COST })
      .eq('user_id', userId);

    if (deductError) {
      return NextResponse.json({ error: '포인트 차감 실패' }, { status: 500 });
    }

    // 포인트 로그 기록
    await supabase.from('point').insert({
      point_id: uuidv4(),
      user_id: userId,
      point: -PROPOSAL_COST,
      reason: 'bid_propose',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('제안 에러:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
