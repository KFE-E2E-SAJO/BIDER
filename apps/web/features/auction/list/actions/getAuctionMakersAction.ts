'use server';

import { getDistanceKm } from '@/features/product/lib/utils';
import getUserId from '@/shared/lib/getUserId';
import { MapAuction } from '@/entities/auction/model/types';
import { AuctionMarkerResponse } from '@/features/auction/list/types';
import { supabase } from '@/shared/lib/supabaseClient';
import { SECRET_PRICE } from '@/features/auction/list/constants';

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

  const { data, error } = await supabase
    .from('auction')
    .select(
      `
    auction_id,
    auction_status,
    auction_end_at,
    min_price,
    bid_history!auction_id (
      bid_price
    ),
    is_secret,
    product:product_id (
      latitude,
      longitude,
      title,
      product_image (
        image_url,
        order_index
      )
    )
  `
    )
    .eq('auction_status', '경매 중');

  if (error) {
    return null;
  }
  const filtered = (data as unknown as MapAuction[]).filter((item) => {
    const { product } = item;
    const distance = getDistanceKm(lat, lng, product.latitude, product.longitude);
    const within5km = distance <= 5;
    return within5km;
  });

  const markers = filtered.map((item) => {
    const bidPrices = item.bid_history?.map((b) => b.bid_price) ?? [];
    const highestBid = bidPrices.length > 0 ? Math.max(...bidPrices) : null;
    const safeBidPrice = item.is_secret ? SECRET_PRICE : (highestBid ?? item.min_price);
    return {
      id: item.auction_id,
      auctionEndAt: item.auction_end_at,
      bidPrice: safeBidPrice,
      title: item.product.title,
      isSecret: item.is_secret,
      location: {
        lat: item.product.latitude,
        lng: item.product.longitude,
      },
      thumbnail:
        item.product.product_image?.find((img) => img.order_index === 0)?.image_url ??
        '/default.png',
    };
  });

  return markers;
}
