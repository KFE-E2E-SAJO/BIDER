import { NextResponse } from 'next/server';
import { getProductInfo } from '@/app/model/chatActions';

export async function GET() {
  const productInfo = await getProductInfo();
  return NextResponse.json(productInfo);
}
