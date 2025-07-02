import { supabase } from '@/shared/lib/supabaseClient';

const fetchListingList = async (userId: string) => {
  const { data, error } = await supabase.from('product').select(`
    *,
    product_image:product_image!product_image_product_id_fkey(*),
    pending_auction:pending_auction!pending_auction_product_id_fkey(*),
    auction:auction!auction_product_id_fkey(
      *,
      bid_history:BidHistory_auction_id_fkey(*)
    )
  `);

  if (error || !data) {
    console.error('출품 데이터 로딩 실패:', error);
    return null;
  }

  const filtered = data.filter((product) => product.exhibit_user_id === userId);

  return filtered;
};

export default fetchListingList;
