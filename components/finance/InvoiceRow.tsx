import type { Invoice } from '@/lib/mockData';

const statusColors: Record<Invoice['status'], string> = {
  paid: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  draft: 'bg-slate-100 text-slate-700',
};

export default function InvoiceRow({ invoice }: { invoice: Invoice }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <span className="material-symbols-rounded">description</span>
        </div>
        <div className="leading-tight">
          <p className="text-lg font-semibold text-slate-900">${invoice.amount.toLocaleString()}</p>
          <p className="text-xs font-mono text-slate-500">{invoice.id} • {invoice.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[invoice.status]}`}>
          {invoice.status.toUpperCase()}
        </span>
        <button className="rounded-full bg-slate-100 p-2 text-slate-600 hover:text-slate-900">
          <span className="material-symbols-rounded">download</span>
        </button>
      </div>
    </div>
  );
}
