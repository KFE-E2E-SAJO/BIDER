import { AUCTION_STATUS } from '@/shared/consts/auctionStatus';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface BidWithAuction {
  auction: { auction_status: string } | null;
}

interface ProductWithAuction {
  product_id: string;
  auction: { auction_status: string } | null;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const userId = formData.get('userId') as string;
  const nickname = formData.get('nickname') as string;
  const isDeleted = formData.get('isDeleted') === 'true';
  const profileImgFile = formData.get('profileImg') as File | null;

  if (!userId || !nickname) {
    return NextResponse.json({ error: '유저 정보가 부족합니다.' }, { status: 400 });
  }

  let profileImgToSave: string | null = null;

  try {
    if (isDeleted) {
      profileImgToSave = null;
    } else if (profileImgFile && profileImgFile instanceof File) {
      const ext = profileImgFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${ext}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-profile-image')
        .upload(filePath, profileImgFile, { contentType: profileImgFile.type });

      if (uploadError) {
        return NextResponse.json(
          { error: `이미지 업로드 실패: ${uploadError.message}` },
          { status: 500 }
        );
      }

      const { data: urlData } = supabase.storage.from('user-profile-image').getPublicUrl(filePath);
      profileImgToSave = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        nickname,
        profile_img: profileImgToSave,
      })
      .eq('user_id', userId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('프로필 수정 실패:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '서버 오류 발생' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: '프로필 정보를 불러오지 못했습니다.' }, { status: 400 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('nickname, email, profile_img, address')
    .eq('user_id', userId)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: '프로필 정보를 불러오지 못했습니다.' }, { status: 500 });
  }

  const [bidRes, productRes] = await Promise.all([
    supabase
      .from('bid_history')
      .select('auction_id, auction:auction_id(auction_status)')
      .eq('bid_user_id', userId),

    supabase
      .from('product')
      .select('product_id, auction:auction!auction_product_id_fkey(auction_status)')
      .eq('exhibit_user_id', userId),
  ]);

  if (bidRes.error || productRes.error) {
    return NextResponse.json({ error: '내 경매 정보를 불러오지 못했습니다.' }, { status: 500 });
  }

  const seenAuctionIds = new Set<string>();
  const uniqueBidData: BidWithAuction[] = [];

  (bidRes.data as { auction_id: string; auction: any }[]).forEach((item) => {
    const auctionId = item.auction_id;
    if (!seenAuctionIds.has(auctionId)) {
      seenAuctionIds.add(auctionId);
      uniqueBidData.push({
        auction: Array.isArray(item.auction) ? (item.auction[0] ?? null) : (item.auction ?? null),
      });
    }
  });

  const productData: ProductWithAuction[] = (
    productRes.data as { product_id: string; auction: any }[]
  ).map((item) => ({
    product_id: item.product_id,
    auction: Array.isArray(item.auction) ? (item.auction[0] ?? null) : (item.auction ?? null),
  }));

  const bidCount = uniqueBidData.length;
  const bidProgressCount = uniqueBidData.filter(
    (b) => b.auction?.auction_status === AUCTION_STATUS.IN_PROGRESS
  ).length;

  const listingCount = productData.length;
  const listingProgressCount = productData.filter(
    (p) => p.auction?.auction_status === AUCTION_STATUS.IN_PROGRESS
  ).length;

  return NextResponse.json({
    success: true,
    data: {
      profile,
      auction: {
        bidCount,
        bidProgressCount,
        listingCount,
        listingProgressCount,
      },
    },
  });
}
