'use client';

import { useEffect, useMemo, useState } from 'react';
import { MetricCard } from '@/components/ui/MetricCard';
import { FormCard } from '@/components/ui/FormCard';
import { StatsChart } from '@/components/ui/StatsChart';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';
import { apiGet } from '@/lib/api';
import type { Application, Metric } from '@/lib/types';

interface StatsResponse {
  applications: Application[];
  metrics: Metric[];
}

export default function StatsPage() {
  const { initData } = useTelegramInitData();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await apiGet<StatsResponse>('/api/stats', { initData });
        setStats(payload);
        if (!selectedId && payload.applications.length > 0) {
          setSelectedId(payload.applications[payload.applications.length - 1]?.id);
        }
      } catch (err) {
        setError((err as Error).message);
      }
    };

    if (!stats && initData) {
      load();
    }
  }, [initData, selectedId, stats]);

  const selectedApplication = useMemo(() => {
    return stats?.applications.find((app) => app.id === selectedId) || null;
  }, [selectedId, stats]);

  const selectedMetrics = useMemo(() => {
    if (!stats || !selectedApplication) return [];
    return stats.metrics
      .filter((metric) => metric.application_id === selectedApplication.id)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [selectedApplication, stats]);

  const totals = useMemo(() => {
    const impressions = selectedMetrics.reduce((sum, metric) => sum + metric.impressions, 0);
    const clicks = selectedMetrics.reduce((sum, metric) => sum + metric.clicks, 0);
    const cost = selectedMetrics.reduce((sum, metric) => sum + metric.cost, 0);
    const ctr = impressions ? (clicks / impressions) * 100 : 0;

    return { impressions, clicks, cost, ctr };
  }, [selectedMetrics]);

  const labels = selectedMetrics.map((m) => new Date(m.timestamp).toLocaleDateString());
  const datasets = [
    {
      label: 'Показы',
      data: selectedMetrics.map((m) => m.impressions),
      backgroundColor: '#5A63FF'
    },
    {
      label: 'Клики',
      data: selectedMetrics.map((m) => m.clicks),
      backgroundColor: '#4BD8A2'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">SOURCEFLOW / Статистика</p>
        <h1 className="text-2xl font-semibold">Статус и метрики</h1>
        <p className="text-sm text-[var(--text-muted)]">Обновление каждые 6 часов. Всё привязано к вашему Telegram.</p>
      </div>

      {error && <p className="text-sm text-[#ff7a98]">{error}</p>}

      <FormCard title="Заявки" description="Выберите нужную заявку, чтобы увидеть детали и динамику.">
        <div className="space-y-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[#0f1118] px-3 py-2 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
          >
            <option value="" disabled>
              {stats?.applications.length ? 'Выберите заявку' : 'Заявок пока нет'}
            </option>
            {stats?.applications.map((app) => (
              <option key={app.id} value={app.id} className="bg-[#0f1118] text-white">
                {app.service.replace('_', ' ')} · {app.geo.join(', ')} · {new Date(app.created_at).toLocaleDateString()}
              </option>
            ))}
          </select>

          {selectedApplication ? (
            <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[#0f1118] p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1 text-sm text-[var(--text-muted)]">
                  <p>Заявка {selectedApplication.id}</p>
                  <p className="text-white text-base font-semibold">{selectedApplication.service.replace('_', ' ')}</p>
                </div>
                <StatusBadge status={selectedApplication.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-[var(--text-muted)]">
                <div className="rounded-xl bg-[#131620] p-3">
                  <p className="text-[var(--text-muted)]">GEO</p>
                  <p className="text-white">{selectedApplication.geo.join(', ')}</p>
                </div>
                <div className="rounded-xl bg-[#131620] p-3">
                  <p className="text-[var(--text-muted)]">Бюджет</p>
                  <p className="text-white">${selectedApplication.budget.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-[#131620] p-3 col-span-2">
                  <p className="text-[var(--text-muted)]">Ниша</p>
                  <p className="text-white">{selectedApplication.niche}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">Пока нет выбранной заявки.</p>
          )}
        </div>
      </FormCard>

      <FormCard title="Метрики" description="Ключевые показатели за выбранный период.">
        {selectedMetrics.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <MetricCard label="Показы" value={totals.impressions.toLocaleString()} />
            <MetricCard label="Клики" value={totals.clicks.toLocaleString()} />
            <MetricCard label="CTR" value={`${totals.ctr.toFixed(2)}%`} />
            <MetricCard label="Расход" value={`$${totals.cost.toLocaleString()}`} />
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">Статистика появится после запуска и первых обновлений.</p>
        )}
      </FormCard>

      <FormCard title="Динамика" description="Показы и клики в разрезе времени.">
        <StatsChart labels={labels} datasets={datasets} />
      </FormCard>
    </div>
  );
}
