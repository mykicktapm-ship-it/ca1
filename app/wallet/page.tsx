'use client';

import BalanceCard from '@/components/dashboard/BalanceCard';
import SourceCard from '@/components/dashboard/SourceCard';
import { sources } from '@/lib/mockData';
import { useUI } from '@/components/layout/UIContext';

export default function WalletPage() {
  const { openWalletAllocation } = useUI();

  return (
    <div className="space-y-4">
      <BalanceCard balance={14250} onTopUp={openWalletAllocation} />
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
        <p className="font-semibold text-slate-900">TON Connect</p>
        <p className="mt-1">Prepare wallet connection to approve top-ups and future payouts.</p>
        <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          <span className="material-symbols-rounded text-base">account_balance_wallet</span>
          Connect TON Wallet
        </button>
      </div>
    </div>
  );
}
