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
          title,
          exhibit_user_id,
          product_image (
            image_url,
            order_index
          )
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

          const { error: ProposalUpdateError } = await supabase
            .from('proposal')
            .update({
              proposal_status: 'rejected',
              responded_at: new Date().toISOString(),
            })
            .eq('auction_id', auction.auction_id)
            .eq('proposal_status', 'pending');

          if (ProposalUpdateError) {
            throw new Error(`제안하기 상태 업데이트 실패: ${ProposalUpdateError.message}`);
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

            // 낙찰자 닉네임 조회
            const { data: winnerUser, error: winnerUserError } = await supabase
              .from('profiles')
              .select('nickname')
              .eq('user_id', winning_user_id)
              .single();

            if (winnerUserError) {
              throw new Error('낙찰자 닉네임 조회 실패: ' + winnerUserError.message);
            }

            // 상품 이미지 URL 처리
            let product_images = [];
            if (auction.product && auction.product.product_image) {
              if (Array.isArray(auction.product.product_image)) {
                product_images = auction.product.product_image;
              } else if (typeof auction.product.product_image === 'object') {
                product_images = [auction.product.product_image];
              }
            }
            const ordered =
              product_images.find((img: any) => img.order_index === 0) || product_images[0];
            const product_image_url = ordered?.image_url ?? null;
            // (1) chat_room 테이블에서 chatroom_id 조회
            // 1. chat_room 존재여부 확인
            const { data: chatRoom, error: chatRoomError } = await supabase
              .from('chat_room')
              .select('chatroom_id')
              .eq('auction_id', auction.auction_id)
              .eq('bid_user_id', winning_bid.bid_user_id)
              .eq('exhibit_user_id', auction.product.exhibit_user_id)
              .maybeSingle();

            let chatroom_id = chatRoom?.chatroom_id;

            if (!chatroom_id) {
              // 2. 없으면 chat_room 새로 생성 (active 상태 true로!)
              const { data: newChatRoom, error: createError } = await supabase
                .from('chat_room')
                .insert([
                  {
                    auction_id: auction.auction_id,
                    bid_user_id: winning_bid.bid_user_id,
                    exhibit_user_id: auction.product.exhibit_user_id,
                    bid_user_active: true,
                    exhibit_user_active: true,
                    created_at: new Date().toISOString(),
                  },
                ])
                .select('chatroom_id')
                .single();

              if (createError) {
                throw new Error('채팅방 생성 실패: ' + createError.message);
              }
              chatroom_id = newChatRoom.chatroom_id;
            }

            // (2) system_message insert에 chatroom_id 사용
            if (!chatroom_id) throw new Error('chatroom_id 없음: system_message insert 불가');

            const { error: systemMessageError } = await supabase.from('system_message').insert([
              {
                chatroom_id, // 분기처리된 chatroom_id
                product_image_url,
                product_title: auction.product.title,
                nickname: winnerUser.nickname,
                bid_price: winning_bid.bid_price,
                created_at: new Date().toISOString(),
              },
            ]);

            if (systemMessageError) {
              throw new Error('system_message 인서트 실패: ' + systemMessageError.message);
            }
            console.log('system_message insert 직후:', {
              chatroom_id: chatroom_id,
              product_image_url: product_image_url,
              product_title: auction.product.title,
              nickname: winnerUser.nickname,
              bid_price: winning_bid.bid_price,
              created_at: new Date().toISOString(),
            });

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
