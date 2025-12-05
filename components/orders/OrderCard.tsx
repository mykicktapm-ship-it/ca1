import type { Order } from '@/lib/mockData';

const statusStyles: Record<Order['status'], string> = {
  active: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  review: 'bg-blue-100 text-blue-700',
};

const statusIcons: Record<Order['status'], string> = {
  active: 'play_circle',
  warning: 'warning',
  review: 'hourglass_empty',
};

export default function OrderCard({ order }: { order: Order }) {
  const pct = Math.min(100, Math.round((order.metrics.spend / order.metrics.budget) * 100));

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-lg font-semibold text-white">
            {order.name.charAt(0)}
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-slate-900">{order.name}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="material-symbols-rounded text-base">travel_explore</span>
              <span>{order.geo}</span>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">{order.id}</span>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}>
          <span className="material-symbols-rounded text-base">{statusIcons[order.status]}</span>
          {order.status}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">{order.source}</span>
        <span>•</span>
        <span>GEO: {order.geo}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Spend</p>
          <p className="text-lg font-semibold text-slate-900">${order.metrics.spend}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Leads</p>
          <p className="text-lg font-semibold text-slate-900">{order.metrics.leads}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">CPA</p>
          <p className="text-lg font-semibold text-slate-900">${order.metrics.cpa}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Budget</span>
          <span>${order.metrics.budget.toLocaleString()}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-indigo-600" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
