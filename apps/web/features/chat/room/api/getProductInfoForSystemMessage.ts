'use server';

import { supabase } from '@/shared/lib/supabaseClient';

export const getProductInfo = async (productId: string) => {
  const { data, error } = await supabase
    .from('product')
    .select(
      `
            title,
            product_image:product_image (
                image_url
            )
        `
    )
    .eq('product_id', productId)
    .eq('product_image.order_index', 0)
    .maybeSingle();

  if (error || !data) {
    throw new Error('상품 정보 조회 실패');
  }

  return {
    title: data.title,
    imageUrl: data.product_image?.[0]?.image_url ?? '',
  };
};
