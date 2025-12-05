'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';
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
        const response = await fetch('/api/applications', {
          headers: {
            'x-telegram-init': initData
          }
        });

        if (!response.ok) {
          throw new Error('Unable to load application');
        }

        const payload = (await response.json()) as Application[];
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
      const response = await fetch('/api/payments/mock-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ application_id: applicationId, initData })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Payment failed');
      }

      setCtaState('done');
      router.push(`/stats?applicationId=${applicationId}`);
    } catch (err) {
      setCtaState('idle');
      setError((err as Error).message || 'Unable to complete payment');
    }
  };

  return (
    <section className="space-y-6 rounded-2xl bg-white/5 p-6 shadow-lg shadow-black/30">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary">Payment</p>
        <h1 className="text-2xl font-semibold">Complete your request</h1>
        <p className="text-sm text-gray-400">
          Review your application details and finish payment inside Telegram.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>Application ID</span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-primary">
              {applicationId || 'Not provided'}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
              <span className="text-gray-400">Service</span>
              <span className="font-semibold capitalize">{application?.service?.replace('_', ' ') || '—'}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
              <span className="text-gray-400">GEO</span>
              <span className="font-semibold">{application?.geo.join(', ') || '—'}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
              <span className="text-gray-400">Audience</span>
              <span className="text-right font-semibold text-sm text-gray-100">
                {application?.audience || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
              <span className="text-gray-400">Niche</span>
              <span className="font-semibold">{application?.niche || '—'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-4 rounded-xl border border-white/10 bg-primary/5 p-4 shadow-lg shadow-primary/20">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-primary">Amount due</p>
            <p className="text-3xl font-semibold text-white">{amountDue || '—'}</p>
            <p className="text-sm text-gray-300">This payment is processed in Telegram via our mock flow.</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={onPay}
              disabled={!applicationId || ctaState === 'processing' || loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ctaState === 'processing' ? 'Opening Telegram...' : 'Pay in Telegram'}
            </button>
            <button
              disabled
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm font-semibold text-gray-300"
            >
              Alternate method (soon)
            </button>
            {error && <p className="text-sm text-red-300">{error}</p>}
            {ctaState === 'done' && <p className="text-sm text-success">Payment completed. Redirecting...</p>}
            {!initData && <p className="text-xs text-amber-200">Waiting for Telegram session...</p>}
          </div>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading your application...</p>}
    </section>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<p className="text-sm text-gray-400">Loading payment form...</p>}>
      <PayContent />
    </Suspense>
  );
}
