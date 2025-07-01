import { supabase } from '@/shared/lib/supabaseClient';
import { ListingFromDB } from '../model/getListingList';

const fetchListingList = async (userId: string) => {
  const { data, error } = await supabase.from('auction').select(`
      auction_id,
      auction_status,
      auction_end_at,
      min_price,
      winning_bid_id,
      winning_bid_user_id,
      created_at,
      updated_at,

      winner:winning_bid_user_id (
        user_id,
        nickname,
        profile_img
      ),

      product:product_id (
        product_id,
        title,
        category,
        exhibit_user_id,

        seller:exhibit_user_id (
          user_id,
          nickname,
          profile_img
        ),

        location:exhibit_user_id (
          address,
          latitude,
          longitude
        ),

        product_image (
          image_url,
          order_index
        ),

        profiles (
          address,
          latitude,
          longitude
        ),

        pending_auction:pending_auction (
          pending_auction_id,
          auction_status,
          auction_end_at,
          scheduled_create_at,
          completed_at
        )
      ),

      bid_history:BidHistory_auction_id_fkey (
        bid_id,
        bid_user_id,
        bid_price,
        bid_at,
        is_awarded,

        bidder:bid_user_id (
          user_id,
          nickname,
          profile_img
        )
      )
    `);

  if (error || !data) {
    console.error('출품 데이터 로딩 실패:', error);
    return null;
  }

  const filtered = data.filter((item) => {
    const product = Array.isArray(item.product) ? item.product[0] : item.product;
    return product?.exhibit_user_id === userId;
  });

  return filtered;
};

export default fetchListingList;
