import { NextRequest, NextResponse } from 'next/server';

const KEY = process.env.NEXT_PUBLIC_VWORLD_KEY;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const point = searchParams.get('point');

  const url = `https://api.vworld.kr/req/address?service=address&request=getAddress&type=both&crs=epsg:4326&zipcode=false&simple=false&format=json&key=${KEY}&point=${point}`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}
