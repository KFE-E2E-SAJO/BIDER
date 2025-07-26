import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {}

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');

  const { data, error } = await supabase
    .from('point')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('포인트 내역 API 실패:', error);
    return null;
  }

  return NextResponse.json(data);
}
