import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// 클라이언트 컴포넌트에서 사용할 Supabase 클라이언트
export const supabase = createClientComponentClient();

// 서버 컴포넌트나 미들웨어에서 사용할 때는 별도로 import 필요
