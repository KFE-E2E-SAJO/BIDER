import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const res = NextResponse.json({ success: true });
  res.cookies.delete('user-has-address');
  return res;
}
