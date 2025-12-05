'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormCard } from '@/components/ui/FormCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';
import { apiGet, apiPost } from '@/lib/api';
import type { Application } from '@/lib/types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

function PayContent() {
  const router = useRouter();
  const { initData } = useTelegramInitData();
  const params = useSearchParams();
  const applicationId = params.get('application_id') || '';

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ctaState, setCtaState] = useState<'idle' | 'processing' | 'done'>('idle');

  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId) return;

      setLoading(true);
      setError(null);

      try {
        const payload = await apiGet<Application[]>('/api/applications', { initData });
        const match = payload.find((item) => item.id === applicationId) || null;

        if (!match) {
          throw new Error('Application not found');
        }

        setApplication(match);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (initData) {
      fetchApplication();
    }
  }, [applicationId, initData]);

  const amountDue = useMemo(() => {
    if (!application) return null;
    return currency.format(application.budget || 0);
  }, [application]);

  const onPay = async () => {
    if (!applicationId) return;
    setCtaState('processing');
    setError(null);

    try {
      await apiPost('/api/payments/mock-complete', { application_id: applicationId }, { initData });

      setCtaState('done');
      router.push(`/stats?applicationId=${applicationId}`);
    } catch (err) {
      setCtaState('idle');
      setError((err as Error).message || 'Unable to complete payment');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">SOURCEFLOW / Оплата</p>
        <h1 className="text-2xl font-semibold">Завершите заказ</h1>
        <p className="text-sm text-[var(--text-muted)]">Проверьте детали заявки и оплатите прямо внутри Telegram.</p>
      </div>

      <FormCard
        title="Заявка"
        description="Все параметры, которые мы зафиксировали."
        action={<StatusBadge status={application?.status || 'new'} />}
      >
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-[#0f1118] px-3 py-2">
            <span className="text-[var(--text-muted)]">ID</span>
            <span className="font-semibold text-white">{applicationId || '—'}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#0f1118] px-3 py-2">
            <span className="text-[var(--text-muted)]">GEO</span>
            <span className="font-semibold text-white">{application?.geo.join(', ') || '—'}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#0f1118] px-3 py-2">
            <span className="text-[var(--text-muted)]">Платформа</span>
            <span className="font-semibold text-white capitalize">{application?.service?.replace('_', ' ') || '—'}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#0f1118] px-3 py-2">
            <span className="text-[var(--text-muted)]">Ниша</span>
            <span className="font-semibold text-white">{application?.niche || '—'}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#0f1118] px-3 py-2">
            <span className="text-[var(--text-muted)]">ЦА</span>
            <span className="text-right text-sm font-semibold text-white">{application?.audience || '—'}</span>
          </div>
        </div>
      </FormCard>

      <FormCard title="Оплата" description="Мы используем встроенный платежный поток Telegram.">
        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[#0f1118] p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-muted)]">К оплате</span>
            <span className="text-2xl font-semibold text-white">{amountDue || '—'}</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Статус: <span className="text-white">ожидает оплаты</span>. После оплаты статус поменяется на paid, а мы запустим трафик.
          </p>
          <div className="space-y-2">
            <button
              onClick={onPay}
              disabled={!applicationId || ctaState === 'processing' || loading}
              className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(90,99,255,0.35)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ctaState === 'processing' ? 'Открываем оплату...' : 'Оплатить'}
            </button>
            <button
              disabled
              className="w-full rounded-xl border border-[var(--border)] bg-[#0f1118] px-4 py-3 text-sm font-semibold text-[var(--text-muted)]"
            >
              Альтернативные методы (скоро)
            </button>
          </div>
          {error && <p className="text-sm text-[#ff7a98]">{error}</p>}
          {ctaState === 'done' && <p className="text-sm text-emerald-200">Оплата подтверждена. Перенаправляем...</p>}
          {!initData && <p className="text-xs text-amber-200">Ожидаем сессию Telegram...</p>}
        </div>
        <p className="text-xs text-[var(--text-muted)]">Выполнение и обновление статистики каждые 6 часов.</p>
        <button
          type="button"
          onClick={() => router.push(`/stats?applicationId=${applicationId}`)}
          className="w-full rounded-xl border border-[var(--border)] bg-[#0f1118] px-4 py-3 text-sm font-semibold text-white transition hover:border-[var(--primary)]/60"
        >
          Перейти к статусу
        </button>
      </FormCard>

      {loading && <p className="text-sm text-[var(--text-muted)]">Загружаем вашу заявку...</p>}
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--text-muted)]">Готовим оплату...</p>}>
      <PayContent />
    </Suspense>
  );
}
