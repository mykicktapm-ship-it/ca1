interface AllocationCardProps {
  allocated: number;
  spent: number;
}

export default function AllocationCard({ allocated, spent }: AllocationCardProps) {
  const pct = Math.min(100, Math.round((spent / allocated) * 100));
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Active Allocation</p>
          <p className="text-2xl font-semibold text-slate-900">${allocated.toLocaleString()}</p>
        </div>
        <span className="material-symbols-rounded text-indigo-500">speed</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full bg-indigo-600" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>Spent ${spent.toLocaleString()}</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}
