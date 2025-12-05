'use client';

interface StatusItem {
  label: string;
  value: number;
  color: string;
}

interface ApplicationStatusCardProps {
  total: number;
  items: StatusItem[];
}

export function ApplicationStatusCard({ total, items }: ApplicationStatusCardProps) {
  return (
    <div className="space-y-4 rounded-2xl bg-white/5 p-6 shadow-lg shadow-black/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary">Applications</p>
          <h2 className="text-xl font-semibold text-white">Status overview</h2>
          <p className="text-sm text-gray-400">Quick view of where your requests stand.</p>
        </div>
        <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">{total} total</span>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="flex items-center justify-between text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <p className="capitalize">{item.label}</p>
              </div>
              <p className="font-semibold">{item.value}</p>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${total ? Math.round((item.value / total) * 100) : 0}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
