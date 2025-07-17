import { Location } from '@/features/location/types';
import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

interface ErrorResponse {
  error: string;
  code?: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, lat, lng, address } = body;

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

export async function GET(
  req: NextRequest
): Promise<NextResponse<{ data: Location } | ErrorResponse>> {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get('userId');

  const { data, error } = await supabase
    .from('profiles')
    .select('latitude, longitude')
    .eq('user_id', userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const location = {
    lat: data.latitude,
    lng: data.longitude,
  } as Location;

  return NextResponse.json({
    data: location,
  });
}
