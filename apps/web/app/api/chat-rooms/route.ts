import { NextResponse } from 'next/server';
import { chatRoomsWithImage } from '@/app/model/chatActions';

export async function GET() {
  // chatRoomsWithImage는 이미 완성된 데이터 배열을 반환
  const chatRoomsWithImages = await chatRoomsWithImage();

  console.log('매칭된 이미지:', chatRoomsWithImages);
  return NextResponse.json(chatRoomsWithImages);
}
