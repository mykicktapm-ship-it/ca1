'use client';

import BalanceCard from '@/components/dashboard/BalanceCard';
import AllocationCard from '@/components/dashboard/AllocationCard';
import ActiveOrdersCard from '@/components/dashboard/ActiveOrdersCard';
import RoiCard from '@/components/dashboard/RoiCard';
import SourceCard from '@/components/dashboard/SourceCard';
import { sources } from '@/lib/mockData';
import { useUI } from '@/components/layout/UIContext';

export default function DashboardPage() {
  const { openWalletAllocation } = useUI();

  return (
    <div className="space-y-6 pb-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <BalanceCard balance={14250} onTopUp={openWalletAllocation} />
        </div>
        <AllocationCard allocated={12400} spent={6800} />
        <ActiveOrdersCard count={12} delta="+2 today" />
        <RoiCard roi={142} />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Source Wallet</h2>
          <button
            onClick={openWalletAllocation}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Manage Allocation
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </section>
    </div>
  );
}
