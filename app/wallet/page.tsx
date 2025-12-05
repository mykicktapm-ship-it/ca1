'use client';

import { useEffect, useState } from 'react';
import BalanceCard from '@/components/dashboard/BalanceCard';
import SourceCard from '@/components/dashboard/SourceCard';
import { sources } from '@/lib/mockData';
import { useUI } from '@/components/layout/UIContext';
import TonConnectButton from '@/components/ton/TonConnectButton';
import { fetchSourceWalletMetrics } from '@/lib/metricsClient';
import AppShell from '@/components/layout/AppShell';

function WalletContent() {
  const { openWalletAllocation } = useUI();
  const [metrics, setMetrics] = useState({ balance: 0, allocated: 0, spent: 0 });

  useEffect(() => {
    fetchSourceWalletMetrics().then(setMetrics);
  }, []);

  return (
    <div className="space-y-4">
      <BalanceCard balance={metrics.balance} onTopUp={openWalletAllocation} />
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Allocation</h2>
        <button
          onClick={openWalletAllocation}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Adjust
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>
      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">Wallet status</p>
        <p className="mt-1">Connect TON wallet to approve top-ups and future payouts.</p>
        <div className="mt-3 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
          <TonConnectButton />
        </div>
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <AppShell>
      <WalletContent />
    </AppShell>
  );
}
