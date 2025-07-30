'use server';

import { getDistanceKm } from '@/features/product/lib/utils';
import getUserId from '@/shared/lib/getUserId';
import { MapAuction } from '@/entities/auction/model/types';
import { AuctionMarkerResponse } from '@/features/auction/list/types';
import { supabase } from '@/shared/lib/supabaseClient';

export async function getAuctionMarkersAction(): Promise<AuctionMarkerResponse[] | null> {
  const userId = await getUserId();

  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('latitude, longitude')
    .eq('user_id', userId)
    .single();

  if (!userData?.latitude || !userData?.longitude || userError) {
    return null;
  }

  const lat = userData.latitude;
  const lng = userData.longitude;

  const { data, error } = await supabase.from('auction').select(`
    auction_id,
    product:product_id (
      latitude,
      longitude,
      product_image (
        image_url,
        order_index
      )
    )
  `);

  if (error) {
    return null;
  }
  const filtered = (data as unknown as MapAuction[]).filter((item) => {
    const { product } = item;
    const distance = getDistanceKm(lat, lng, product.latitude, product.longitude);
    return distance <= 5;
  });

  const markers = filtered.map((item) => ({
    id: item.auction_id,
    location: {
      lat: item.product.latitude,
      lng: item.product.longitude,
    },
    thumbnail:
      item.product.product_image?.find((img) => img.order_index === 0)?.image_url ?? '/default.png',
  }));

  return markers;
}
