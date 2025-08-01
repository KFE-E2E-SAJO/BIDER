import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json({ success: true, message: '채팅방 생성 완료' });
}
