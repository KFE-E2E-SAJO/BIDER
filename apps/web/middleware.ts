import { handleRedirect } from '@/shared/lib/middleware/redirect';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 미들웨어 조합
  return handleRedirect(request);
}
