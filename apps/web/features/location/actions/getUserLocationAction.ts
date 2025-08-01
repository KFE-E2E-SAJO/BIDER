'use server';
import { supabase } from '@/shared/lib/supabaseClient';
import type { LocationWithAddress } from '@/features/location/types';
import getUserId from '@/shared/lib/getUserId';
import { ProfileLocationData } from '@/entities/profiles/model/types';

export async function getUserLocationAction(): Promise<LocationWithAddress | null> {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from('profiles')
    .select('latitude, longitude, address')
    .eq('user_id', userId)
    .single<ProfileLocationData>();

  if (error) {
    return null;
  }

  const { latitude, longitude, address } = data;

  return {
    location: {
      lat: latitude,
      lng: longitude,
    },
    address,
  };
}
