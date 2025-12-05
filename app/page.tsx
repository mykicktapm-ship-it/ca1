'use client';

import BalanceCard from '@/components/dashboard/BalanceCard';
import AllocationCard from '@/components/dashboard/AllocationCard';
import ActiveOrdersCard from '@/components/dashboard/ActiveOrdersCard';
import RoiCard from '@/components/dashboard/RoiCard';
import SourceCard from '@/components/dashboard/SourceCard';
import { useEffect, useState } from 'react';
import { sources } from '@/lib/mockData';
import { useUI } from '@/components/layout/UIContext';
import { fetchDashboardMetrics } from '@/lib/metricsClient';
import AppShell from '@/components/layout/AppShell';

function DashboardContent() {
  const { openWalletAllocation } = useUI();
  const [stats, setStats] = useState({ balance: 0, allocated: 0, spent: 0, activeOrders: 0, roi: 0 });

  useEffect(() => {
    fetchDashboardMetrics().then(setStats);
    const interval = setInterval(() => fetchDashboardMetrics().then(setStats), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <BalanceCard balance={stats.balance} onTopUp={openWalletAllocation} />
        </div>
        <AllocationCard allocated={stats.allocated} spent={stats.spent} />
        <ActiveOrdersCard count={stats.activeOrders} delta="+2 today" />
        <RoiCard roi={stats.roi} />
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

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
