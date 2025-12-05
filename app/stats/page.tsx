'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import WebApp from '@twa-dev/sdk';
import type { Application, Metric } from '@/lib/types';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface StatsResponse {
  applications: Application[];
  metrics: Metric[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/stats', {
          headers: {
            'x-telegram-init': WebApp.initData || ''
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

    load();
  }, []);

  const labels = stats?.metrics.map((m) => new Date(m.timestamp).toLocaleDateString()) || [];
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Impressions',
        data: stats?.metrics.map((m) => m.impressions) || [],
        backgroundColor: '#5A63FF'
      },
      {
        label: 'Clicks',
        data: stats?.metrics.map((m) => m.clicks) || [],
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

      <div className="rounded-2xl bg-white/5 p-6 shadow-lg shadow-black/30">
        {error && <p className="text-red-300">{error}</p>}
        {!error && stats && stats.metrics.length > 0 ? (
          <Bar data={chartData} className="bg-black/20" />
        ) : (
          <p className="text-sm text-gray-400">No metrics available yet.</p>
        )}
      </div>

      <div className="space-y-3 rounded-2xl bg-white/5 p-6 shadow-lg shadow-black/30">
        <h2 className="text-lg font-semibold">Applications</h2>
        <div className="space-y-3">
          {stats?.applications?.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3"
            >
              <div>
                <p className="font-medium">{app.service}</p>
                <p className="text-xs text-gray-400">Geo: {app.geo.join(', ')}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-primary">
                {app.status.replace('_', ' ')}
              </span>
            </div>
          )) || <p className="text-sm text-gray-400">No applications yet.</p>}
        </div>
      </div>
    </section>
  );
}
