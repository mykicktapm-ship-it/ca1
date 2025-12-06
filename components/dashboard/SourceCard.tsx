import type { Source } from '@/lib/mockData';

interface SourceCardProps {
  source: Source;
}

function SourceCard({ source }: SourceCardProps) {
  const pct = Math.min(100, Math.round((source.spent / source.allocated) * 100));
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${source.color}`}>
            {source.logo}
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-slate-900">{source.name}</p>
            <p className="text-xs text-emerald-600">Active</p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-500">{pct}%</span>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Allocated ${source.allocated.toLocaleString()}</span>
        <span>Spent ${source.spent.toLocaleString()}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full bg-indigo-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export { SourceCard };
