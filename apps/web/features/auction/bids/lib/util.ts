import { supabase } from '@/shared/lib/supabaseClient';

const fetchBidList = async (userId: string) => {
  const { data, error } = await supabase
    .from('bid_history')
    .select(
      `
      *,
      auction:auction_id(
        *,
        product:product_id(
          *,
          product_image:product_image!product_image_product_id_fkey(*)
        )
      )
    `
    )
    .eq('bid_user_id', userId);

  if (error || !data) {
    console.error('입찰 데이터 로딩 실패:', error);
    return null;
  }

  return data;
};

export default fetchBidList;
