'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ActiveCampaignsPanel } from '@/components/dashboard/ActiveCampaignsPanel';
import { ApplicationStatusCard } from '@/components/dashboard/ApplicationStatusCard';
import { MySourcesGrid, type SourceOverview } from '@/components/dashboard/MySourcesGrid';
import { PortfolioDonut } from '@/components/dashboard/PortfolioDonut';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';
import type { Application, Metric } from '@/lib/types';

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false });

interface StatsResponse {
  applications: Application[];
  metrics: Metric[];
}

type Timeframe = '7d' | '30d' | 'all';

type StatusBreakdown = Record<Application['status'], number>;

export default function StatsPage() {
  const { initData } = useTelegramInitData();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('7d');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  useEffect(() => {
    const registerCharts = async () => {
      const { ArcElement, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } = await import('chart.js');
      Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
    };

    registerCharts();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/stats', {
          headers: {
            'x-telegram-init': initData
          }
        });
        if (!res.ok) {
          throw new Error('Failed to load stats');
        }
        const payload = (await res.json()) as StatsResponse;
        setStats(payload);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    if (!stats) {
      load();
    }
  }, [initData, stats]);

  const applicationLookup = useMemo(() => {
    const map = new Map<string, Application>();
    stats?.applications.forEach((app) => map.set(app.id, app));
    return map;
  }, [stats]);

  const filteredApplications = useMemo(() => {
    if (!stats) return [];
    return stats.applications.filter((app) => serviceFilter === 'all' || app.service === serviceFilter);
  }, [serviceFilter, stats]);

  const serviceOptions = useMemo(
    () => Array.from(new Set(stats?.applications.map((app) => app.service))).sort(),
    [stats]
  );

  const filteredMetrics = useMemo(() => {
    if (!stats) return [];
    const now = Date.now();
    const windowMs = timeframe === '7d' ? 7 * 86_400_000 : timeframe === '30d' ? 30 * 86_400_000 : null;

    return stats.metrics.filter((metric) => {
      const app = applicationLookup.get(metric.application_id);
      const matchesService = serviceFilter === 'all' || app?.service === serviceFilter;
      const matchesWindow = windowMs ? now - new Date(metric.timestamp).getTime() <= windowMs : true;
      return matchesService && matchesWindow;
    });
  }, [applicationLookup, serviceFilter, stats, timeframe]);

  const statusBreakdown = useMemo(() => {
    const counts: StatusBreakdown = { completed: 0, in_progress: 0, new: 0, paid: 0 };
    filteredApplications.forEach((app) => {
      counts[app.status] += 1;
    });
    return counts;
  }, [filteredApplications]);

  const serviceAggregates = useMemo(() => {
    const aggregates = new Map<
      string,
      { impressions: number; clicks: number; cost: number; geo: Set<string>; applications: Application[] }
    >();

    filteredApplications.forEach((app) => {
      const existing = aggregates.get(app.service) || {
        impressions: 0,
        clicks: 0,
        cost: 0,
        geo: new Set<string>(),
        applications: [] as Application[]
      };
      existing.applications.push(app);
      app.geo.forEach((g) => existing.geo.add(g));
      aggregates.set(app.service, existing);
    });

    filteredMetrics.forEach((metric) => {
      const app = applicationLookup.get(metric.application_id);
      if (!app) return;
      const entry = aggregates.get(app.service);
      if (!entry) return;
      entry.impressions += metric.impressions;
      entry.clicks += metric.clicks;
      entry.cost += metric.cost;
    });

    return aggregates;
  }, [applicationLookup, filteredApplications, filteredMetrics]);

  const portfolioData = useMemo(() => {
    const palette = ['#5A63FF', '#4BD8A2', '#F59E0B', '#F87171', '#38BDF8'];
    const entries = Array.from(serviceAggregates.entries());
    return entries.map(([service, data], index) => ({
      label: service.replace('_', ' '),
      value: data.cost || data.impressions || data.applications.length,
      color: palette[index % palette.length]
    }));
  }, [serviceAggregates]);

  const sources: SourceOverview[] = useMemo(() => {
    const entries = Array.from(serviceAggregates.entries());
    return entries.map(([service, data], index) => {
      const impressions = data.impressions || 1;
      const ctr = (data.clicks / impressions) * 100;
      const conversions = Math.max(1, Math.round(data.clicks * 0.3));
      const regions = Array.from(data.geo).join(', ');
      const status = data.applications.some((app) => app.status === 'completed') ? 'completed' : 'active';

      return {
        id: service,
        name: service.replace('_', ' '),
        platform: `Source ${index + 1}`,
        region: regions || 'Global',
        spend: Math.round(data.cost || data.applications.length * 120),
        ctr,
        conversions,
        status
      };
    });
  }, [serviceAggregates]);

  const activeCampaigns = useMemo(() => {
    return filteredApplications
      .filter((app) => app.status === 'in_progress' || app.status === 'paid')
      .map((app) => {
        const relatedMetrics = filteredMetrics.filter((metric) => metric.application_id === app.id);
        return {
          id: app.id,
          name: app.service.replace('_', ' '),
          status: app.status,
          reach: relatedMetrics.reduce((sum, metric) => sum + metric.impressions, 0),
          spend: relatedMetrics.reduce((sum, metric) => sum + metric.cost, 0),
          geo: app.geo.join(', '),
          applications: 1
        };
      });
  }, [filteredApplications, filteredMetrics]);

  const labels = filteredMetrics.map((m) => new Date(m.timestamp).toLocaleDateString());
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Impressions',
        data: filteredMetrics.map((m) => m.impressions),
        backgroundColor: '#5A63FF'
      },
      {
        label: 'Clicks',
        data: filteredMetrics.map((m) => m.clicks),
        backgroundColor: '#4BD8A2'
      }
    ]
  };

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary">Performance</p>
        <h1 className="text-2xl font-semibold">Your stats</h1>
        <p className="text-sm text-gray-400">Insights based on your applications and stubbed metrics.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-white/5 p-4 shadow-lg shadow-black/30 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">Filters</span>
          <p className="text-sm text-gray-400">Adjust view by timeframe and source.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-gray-200"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option value="all">All sources</option>
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service.replace('_', ' ')}
              </option>
            ))}
          </select>
          <select
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-gray-200"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as Timeframe)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-300">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <PortfolioDonut
            subtitle="Distribution of spend and reach by source"
            data={portfolioData}
          />
          <div className="space-y-3 rounded-2xl bg-white/5 p-6 shadow-lg shadow-black/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-primary">Timeline</p>
                <h2 className="text-xl font-semibold">Engagement trend</h2>
              </div>
              <span className="text-xs text-gray-400">{labels.length} data points</span>
            </div>
            {!error && filteredMetrics.length > 0 ? (
              <Bar data={chartData} className="bg-black/20" />
            ) : (
              <p className="text-sm text-gray-400">No metrics available yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <ApplicationStatusCard
            total={filteredApplications.length}
            items={[
              { label: 'new', value: statusBreakdown.new, color: '#38BDF8' },
              { label: 'paid', value: statusBreakdown.paid, color: '#5A63FF' },
              { label: 'in_progress', value: statusBreakdown.in_progress, color: '#4BD8A2' },
              { label: 'completed', value: statusBreakdown.completed, color: '#F59E0B' }
            ]}
          />
          <ActiveCampaignsPanel campaigns={activeCampaigns} />
        </div>
      </div>

      <MySourcesGrid sources={sources} />
    </section>
  );
}
