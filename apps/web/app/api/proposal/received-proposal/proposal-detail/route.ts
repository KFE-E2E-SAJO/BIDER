import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const proposalId = searchParams.get('proposalId');
    const userId = searchParams.get('userId');

    if (!userId || !proposalId) {
      return NextResponse.json(
        { success: false, message: '요청 정보가 부족합니다.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('proposal')
      .select(
        `
      *,
      auction:proposal_auction_id_fkey(
        auction_id,
        min_price,
        bid_history!auction_id(bid_price),
        product:product_id(
          product_id,
          title,
          product_image:product_image!product_image_product_id_fkey(image_url),
            exhibit_user_id
          )
        ),
      proposer_id:proposal_proposer_id_fkey(nickname, profile_img, user_id)    
    `
      )
      .eq('proposal_id', proposalId)
      .single();

    if (error || !data) {
      throw new Error(`받은 제안 데이터 상세 조회 실패: ${error}`);
    }

    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '상품 불러오기 실패', error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposalId, proposalStatus, userId } = body;

    if (!proposalId || !proposalStatus || !userId) {
      return NextResponse.json(
        { success: false, message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const { data: proposal, error: proposalError } = await supabase
      .from('proposal')
      .select(
        `
        *,
        auction:proposal_auction_id_fkey(
          auction_id,
          auction_status,
          bid_history!auction_id(bid_id),
          product:product_id(exhibit_user_id)
        )
      `
      )
      .eq('proposal_id', proposalId)
      .single();

    if (proposalError || !proposal) {
      throw new Error(`제안 정보 조회 실패 : ${proposalError?.message}`);
    }

    // 권한 확인: 본인이 출품한 상품인지
    if (proposal.auction.product.exhibit_user_id !== userId) {
      return NextResponse.json({ success: false, message: '권한이 없습니다.' }, { status: 403 });
    }

    // 제안 상태 업데이트
    const updatedStatus = proposalStatus === 'accept' ? 'accepted' : 'rejected';

    const { error: updateError } = await supabase
      .from('proposal')
      .update({
        proposal_status: updatedStatus,
        responded_at: new Date().toISOString(),
      })
      .eq('proposal_id', proposalId);

    if (updateError) {
      throw new Error(`제안 상태 업데이트 실패 : ${updateError.message}`);
    }

    // 제안 수락 시
    if (proposalStatus === 'accept') {
      // 입찰 데이터 삽입
      const { data: bidData, error: bidError } = await supabase
        .from('bid_history')
        .insert([
          {
            auction_id: proposal.auction.auction_id,
            bid_user_id: proposal.proposer_id,
            bid_price: proposal.proposed_price,
            is_awarded: true,
          },
        ])
        .select()
        .single();

      if (bidError) {
        throw new Error(`입찰 데이터 삽입 오류 : ${bidError.message}`);
      }

      // 다른 제안 상태 모두 rejected 처리
      const { error: updateOtherProposalsError } = await supabase
        .from('proposal')
        .update({
          proposal_status: 'rejected',
          responded_at: new Date().toISOString(),
        })
        .eq('auction_id', proposal.auction.auction_id)
        .neq('proposal_id', proposalId);

      if (updateOtherProposalsError) {
        throw new Error(`다른 제안 상태 변경 실패 : ${updateOtherProposalsError.message}`);
      }

      // 경매 상태 종료 처리
      const { error: endAuctionError } = await supabase
        .from('auction')
        .update({
          auction_status: '경매 종료',
          winning_bid_user_id: proposal.proposer_id,
          winning_bid_id: bidData.bid_id,
          auction_end_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('auction_id', proposal.auction.auction_id);

      if (endAuctionError) {
        throw new Error(`경매 종료 실패 : ${endAuctionError.message}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /proposal/status 에러:', error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
