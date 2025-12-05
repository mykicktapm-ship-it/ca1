import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { extractUserId } from '@/lib/telegram';
import type { Application } from '@/lib/types';

const getUserId = (initData?: string | null) => extractUserId(initData || '');

export async function GET(request: Request) {
  const initData = request.headers.get('x-telegram-init');
  const userId = getUserId(initData);

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    const stub: Application[] = [
      {
        id: 'demo-new',
        user_id: userId,
        geo: ['US', 'CA'],
        service: 'google_ads',
        audience: 'Demo audience',
        budget: 5000,
        niche: 'iGaming',
        status: 'new',
        created_at: new Date().toISOString()
      }
    ];
    return NextResponse.json(stub);
  }

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const initData = body.initData || request.headers.get('x-telegram-init');
  const userId = getUserId(initData);

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const geo = Array.isArray(body.geo)
    ? body.geo
    : String(body.geo || '')
        .split(',')
        .map((item: string) => item.trim())
        .filter(Boolean);

  const record: Omit<Application, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
  } = {
    user_id: userId,
    geo,
    service: body.service,
    audience: body.audience,
    budget: Number(body.budget || 0),
    niche: body.niche,
    status: 'new'
  };

  if (!supabase) {
    const stub = {
      ...record,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    } satisfies Application;
    return NextResponse.json(stub, { status: 201 });
  }

  const { data, error } = await supabase.from('applications').insert(record).select('*').single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
