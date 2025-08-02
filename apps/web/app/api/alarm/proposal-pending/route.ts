import { NextRequest, NextResponse } from 'next/server';
import { sendNotification } from '@/app/actions';
import { createClient } from '@/shared/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const proposalValue = await req.json();

  console.log('-----------proposalValue:', proposalValue, '-------------');

  try {
    const { data, error } = await supabase
      .from('proposal')
      .select(
        `
           *,
           auction:proposal_auction_id_fkey(
             auction_id,
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
      .eq('proposer_id', proposalValue.user_id)
      .order('created_at', { ascending: false });

    console.log('--------data', data, '----------');

    if (error || !data) {
      return NextResponse.json({ error: '데이터 조회 실패' }, { status: 500 });
    }

    const payload = {
      nickname: data[0]?.proposer_id?.nickname,
      productName: data[0]?.auction?.product?.title,
      price: proposalValue.price,
      image: data[0]?.auction?.product?.product_image?.[0]?.image_url,
    };

    await sendNotification(`${proposalValue.user_id}`, 'auction', 'proposalRequest', payload);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('알림 전송 오류:', err);
    return NextResponse.json({ error: '알림 전송 실패' }, { status: 500 });
  }
}
