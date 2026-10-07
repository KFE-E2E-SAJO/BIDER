import 'server-only';
import { createClient } from '@supabase/supabase-js';

// RLS를 우회하는 secret 키 클라이언트. 서버 코드(API Route, Server Action)에서만 사용
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);
