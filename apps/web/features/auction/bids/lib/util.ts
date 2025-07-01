import { supabase } from '@/shared/lib/supabaseClient';

const fetchBidList = async (userId: string) => {
  const { data, error } = await supabase
    .from('bid_history')
    .select(
      `
      is_awarded,
      bid_user_id,
      bid_id,
      bid_at,
      bid_price,

      auction:auction_id (
        auction_id,
        auction_status,
        auction_end_at,
        min_price,

        winning_bid_user_id,
        winner:winning_bid_user_id (
          user_id
        ),

        product:product_id (
          product_id,
          title,
          category,
          exhibit_user_id,

          seller:exhibit_user_id (
            user_id
          ),

          product_image (
            image_url,
            order_index
          ),
          
          profiles (
            address,
            latitude,
            longitude
          )
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
