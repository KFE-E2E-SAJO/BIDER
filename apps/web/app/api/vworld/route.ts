import { NextRequest, NextResponse } from 'next/server';

const KEY = process.env.VWORLD_KEY;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const point = searchParams.get('point');

  const url = `https://api.vworld.kr/req/address?service=address&request=getAddress&type=both&crs=epsg:4326&zipcode=false&simple=false&format=json&key=${KEY}&point=${point}`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    if (!res.ok) {
      console.error('[ERROR] VWorld API fetch failed');
      console.error('[ERROR] Response Status:', res.status);
      console.error('[ERROR] Response Body:', text);
      return NextResponse.json(
        { error: 'VWorld API fetch failed', status: res.status, detail: text },
        { status: 500 }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[EXCEPTION] Error during fetch:', err);
    return NextResponse.json({ error: 'Fetch exception', message: String(err) }, { status: 500 });
  }
}
