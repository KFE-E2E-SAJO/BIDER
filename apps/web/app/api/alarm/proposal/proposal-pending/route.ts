import { NextRequest, NextResponse } from 'next/server';
import { sendNotification } from '@/app/actions';
import { createClient } from '@/shared/lib/supabase/server';

type PendingWithProduct = {
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

type ProductImage = {
  image_url: string;
};

type Product = {
  title: string;
  exhibit_user_id: string;
  product_image: ProductImage[];
};

type AuctionWithProduct = {
  product: Product;
};

type ProfileNicknameOnly = {
  nickname: string;
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const proposalValue = await req.json();

  try {
    // 닉네임 조회(제안자)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('user_id', proposalValue.user_id)
      .returns<ProfileNicknameOnly[]>();

    const nickname = profileData?.[0]?.nickname;

    // 상품 정보 조회
    const { data: auctionData, error: auctionError } = await supabase
      .from('auction')
      .select(
        `
        product (
          title,
          exhibit_user_id,
          product_image (
            image_url
          )
        )
        `
      )
      .eq('auction_id', proposalValue.auctionId)
      .single<AuctionWithProduct>();

    const productInfo = auctionData?.product;

    const payload = {
      nickname: nickname,
      productName: productInfo?.title,
      image: productInfo?.product_image?.[0]?.image_url,
      price: proposalValue.price,
    };

    await sendNotification(
      `${productInfo?.exhibit_user_id}`,
      'auction',
      'proposalRequest',
      payload
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
