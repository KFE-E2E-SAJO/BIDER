import { ProfileLocationData } from '@/entities/profiles/model/types';
import { LocationWithAddress } from '@/features/location/types';
import getUserId from '@/shared/lib/getUserId';
import { supabase } from '@/shared/lib/supabaseClient';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface ErrorResponse {
  error: string;
  code?: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, lat, lng, address } = body;
  const cookieStore = await cookies();
  cookieStore.set('user-has-address', 'true', {
    path: '/',
    expires: new Date('2099-12-31'),
    sameSite: 'lax',
    httpOnly: true,
  });

  if (!userId || !lat || !lng || !address) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      latitude: lat,
      longitude: lng,
      address,
    })
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(): Promise<NextResponse<{ data: LocationWithAddress } | ErrorResponse>> {
  const userId = await getUserId();
  const cookieStore = await cookies();

  const { data, error } = await supabase
    .from('profiles')
    .select('latitude, longitude, address')
    .eq('user_id', userId)
    .single<ProfileLocationData>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { latitude, longitude, address } = data;
  const isValid = latitude != null && longitude != null && address?.trim();

  if (!isValid) {
    cookieStore.delete('user-has-address');
  }

  const location = {
    lat: latitude,
    lng: longitude,
  };

  return NextResponse.json({
    data: {
      location,
      address: data.address,
    },
  });
}
