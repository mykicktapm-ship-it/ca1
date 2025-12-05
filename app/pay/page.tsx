'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import WebApp from '@twa-dev/sdk';

export default function PayPage() {
  const params = useSearchParams();
  const initialId = params.get('application_id') || '';
  const [applicationId, setApplicationId] = useState(initialId);
  const [status, setStatus] = useState<string | null>(null);

  const markPaid = async () => {
    setStatus('processing');
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application_id: applicationId, initData: WebApp.initData || '' })
    });

    if (!res.ok) {
      setStatus('error');
      return;
    }

    setStatus('done');
  };

  return (
    <section className="space-y-6 rounded-2xl bg-white/5 p-6 shadow-lg shadow-black/30">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary">Payment</p>
        <h1 className="text-2xl font-semibold">Mark request as paid</h1>
        <p className="text-sm text-gray-400">Stubbed payment flow for now. We will link a provider later.</p>
      </div>

      <div className="space-y-3">
        <label className="space-y-2 text-sm font-medium">
          <span>Application ID</span>
          <input
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            placeholder="Application id"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
          />
        </label>
        <button
          onClick={markPaid}
          disabled={!applicationId || status === 'processing'}
          className="w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-90 disabled:opacity-50"
        >
          {status === 'processing' ? 'Updating...' : 'Mark as paid'}
        </button>
        {status === 'done' && (
          <p className="text-sm text-success">Application marked as paid.</p>
        )}
        {status === 'error' && <p className="text-sm text-red-300">Failed to update status.</p>}
      </div>
    </section>
  );
}
