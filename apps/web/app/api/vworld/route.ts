import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const point = searchParams.get('point');

  const url = `https://api.vworld.kr/req/address?service=address&request=getAddress&type=both&crs=epsg:4326&zipcode=false&simple=false&format=json&key=2DBB9BE5-D790-349B-A105-250C70BCAFD3&point=${point}`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}
