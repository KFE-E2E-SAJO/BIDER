import { sendNotification } from '@/app/actions';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

type ProposalWithProduct = {
  proposer_id: string;
  proposed_price: number;
  auction_id: string;
  auction: {
    product: {
      title: string;
      exhibit_user_id: string;
      product_image: {
        image_url: string;
        order_index: number;
      }[];
    };
  };
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const proposalValue = await req.json();

  try {
    const { data: proposalData, error: proposalError } = await supabase
      .from('proposal')
      .select(
        `s
        proposer_id,
        proposed_price,
        auction_id,
        auction (
          product (
            title,
            exhibit_user_id,
            product_image (
              image_url,
              order_index
            )
          )
        )
      `
      )
      .eq('proposal_id', proposalValue.proposalId)
      .single<ProposalWithProduct>();

    if (proposalError || !proposalData) {
      console.error('제안 데이터 조회 실패:', proposalError);
      return NextResponse.json(
        {
          error: '제안 정보를 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    const proposerId = proposalData.proposer_id;
    const productInfo = proposalData.auction.product;

    const { data: sellerProfile, error: sellerError } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('user_id', proposalValue.user_id)
      .single();

    if (sellerError || !sellerProfile) {
      console.error('판매자 프로필 조회 실패:', sellerError);
      return NextResponse.json(
        {
          error: '사용자 정보를 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    const sellerNickname = sellerProfile.nickname;

    const sortedImages = productInfo?.product_image?.sort((a, b) => a.order_index - b.order_index);
    const firstImageUrl = sortedImages?.[0]?.image_url ?? '';

    const { data: chat, error: chatError } = await supabase
      .from('chat_room')
      .select('chatroom_id')
      .eq('bid_user_id', proposalData.proposer_id)
      .eq('exhibit_user_id', proposalData.auction.product.exhibit_user_id);

    if (chatError) {
      console.error('chat_room 조회 실패:', chatError);
    }

    const payload = {
      nickname: sellerNickname,
      productName: productInfo?.title,
      image: firstImageUrl,
      price: proposalData.proposed_price,
      chatroomId: chat?.[0]?.chatroom_id ?? null,
    };

    const { error: notificationError } = await sendNotification(
      proposerId,
      'auction',
      'proposalAccepted',
      payload
    );
    if (notificationError) {
      throw new Error(`알림 전송 실패: ${notificationError}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('제안 수락 알림 전송 오류:', err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : '알림 전송 실패',
      },
      { status: 500 }
    );
  }
}
