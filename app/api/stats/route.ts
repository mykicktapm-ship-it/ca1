import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { extractUserId } from '@/lib/telegram';
import type { Application, Metric } from '@/lib/types';

export async function GET(request: Request) {
  const initData = request.headers.get('x-telegram-init');
  const userId = extractUserId(initData || '');

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    const stubApplications: Application[] = [
      {
        id: 'demo-1',
        user_id: userId,
        geo: ['US'],
        service: 'google_ads',
        audience: 'Stub audience',
        budget: 1000,
        niche: 'iGaming',
        status: 'paid',
        created_at: new Date().toISOString()
      }
    ];

    const now = Date.now();
    const stubMetrics: Metric[] = Array.from({ length: 5 }).map((_, index) => ({
      id: `metric-${index}`,
      application_id: 'demo-1',
      impressions: 1000 + index * 200,
      clicks: 100 + index * 20,
      cost: 200 + index * 40,
      timestamp: new Date(now - index * 86400000).toISOString()
    }));

    return NextResponse.json({ applications: stubApplications, metrics: stubMetrics });
  }

  const { data: applications, error: applicationsError } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId);

  if (applicationsError) {
    return NextResponse.json({ message: applicationsError.message }, { status: 500 });
  }

  const applicationIds = (applications || []).map((app) => app.id);

  const { data: metrics, error: metricsError } =
    applicationIds.length > 0
      ? await supabase.from('metrics').select('*').in('application_id', applicationIds)
      : { data: [], error: null };

  if (metricsError) {
    return NextResponse.json({ message: metricsError.message }, { status: 500 });
  }

  return NextResponse.json({
    applications: (applications || []) as Application[],
    metrics: (metrics || []) as Metric[]
  });
}
