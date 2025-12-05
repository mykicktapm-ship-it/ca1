import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { extractUserId } from '@/lib/telegram';
import type { ApplicationStatus } from '@/lib/types';

export async function POST(request: Request) {
  const body = await request.json();
  const initData = body.initData || request.headers.get('x-telegram-init');
  const userId = extractUserId(initData || '');
  const applicationId = body.application_id as string;

  if (!userId || !applicationId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ application_id: applicationId, status: 'paid' satisfies ApplicationStatus });
  }

  const { error } = await supabase
    .from('applications')
    .update({ status: 'paid' })
    .eq('id', applicationId)
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ application_id: applicationId, status: 'paid' as ApplicationStatus });
}
