import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabaseClient';
import { createPointByReason } from '@/features/point/api/createPointByReason';
import getUserId from '@/shared/lib/getUserId';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = await getUserId();
    const auctionId = formData.get('auctionId') as string;
    const proposedPrice = parseInt(formData.get('proposedPrice') as string, 10);

    if (!userId || !auctionId || isNaN(proposedPrice)) {
      return NextResponse.json({ error: '입력값이 유효하지 않습니다.' }, { status: 400 });
    }

    const { error: proposalError } = await supabase.from('proposal').insert({
      proposal_id: uuidv4(),
      auction_id: auctionId,
      proposer_id: userId,
      proposed_price: proposedPrice,
      proposal_status: 'pending',
    });

    if (proposalError) {
      throw new Error(`제안 보내기 실패: ${proposalError.message}`);
    }

    await createPointByReason('bid_propose', userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('GET /auction 에러:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
