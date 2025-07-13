import { createClient } from '@supabase/supabase-js';
import customStorageAdapter from './customStorageAdapter';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    detectSessionInUrl: true, // URL에서 code를 자동으로 찾아서 세션을 만들어줌
    flowType: 'pkce', // PKCE 방식을 사용하겠다는 뜻
    storage: customStorageAdapter,
  },
});
