import { NextResponse } from 'next/server';
import { sendNotification } from '@/app/actions';

export async function POST(request: Request) {
  try {
    const result = await sendNotification('auction', 'bidUpdated', {
      productName: '노트북',
      productId: '555',
      // price: 1000000,
      // nickname:'개발하다 치친다'
      image: '이미지 경로',
    });

    // result가 undefined인 경우 기본값 설정
    if (result === undefined || result === null) {
      return NextResponse.json({
        success: true,
        message: '알림 전송 완료',
      });
    }

    // JSON 직렬화 테스트
    try {
      const testJson = JSON.stringify(result);
      console.log('JSON 직렬화 성공:', testJson);
    } catch (jsonError) {
      console.error('JSON 직렬화 실패:', jsonError);
      return NextResponse.json({
        success: false,
        error: 'JSON 직렬화 오류',
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('=== API 오류 ===', error);
    return NextResponse.json(
      {
        success: false,
        error: '서버 오류',
      },
      { status: 500 }
    );
  }
}
