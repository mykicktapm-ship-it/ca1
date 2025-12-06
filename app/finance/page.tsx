'use client';

import InvoiceRow from '@/components/finance/InvoiceRow';
import { invoices } from '@/lib/mockData';
import TonConnectButton from '@/components/ton/TonConnectButton';
import AppShell from '@/components/layout/AppShell';

function FinanceContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Finance</h1>
        <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20">
          <span className="material-symbols-rounded text-base">add</span>
          Request
        </button>
      </div>
      <div className="space-y-3">
        {invoices.map((invoice) => (
          <InvoiceRow key={invoice.id} invoice={invoice} />
        ))}
      </div>
      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">Pay via TON Connect</p>
        <p className="mt-1">Use your TON wallet to settle invoices directly inside the mini app.</p>
        <div className="mt-3 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
          <TonConnectButton />
        </div>
      </div>
    </div>
  );
}

export default function FinancePage() {
  return (
    <AppShell>
      <FinanceContent />
    </AppShell>
  );
}
