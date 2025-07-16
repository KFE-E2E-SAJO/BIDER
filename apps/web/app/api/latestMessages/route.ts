import { NextResponse } from 'next/server';
import { getLatestMessages } from '@/app/model/chatActions';

export async function GET() {
  // chatRoomsWithImage는 이미 완성된 데이터 배열을 반환
  const latestMessages = await getLatestMessages();
  console.log('메시지 미리보기:', latestMessages);
  return NextResponse.json(latestMessages);
}
