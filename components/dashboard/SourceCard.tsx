'use client';

interface SourceCardProps {
  name: string;
  platform: string;
  region: string;
  spend: number;
  ctr: number;
  conversions: number;
  status: string;
}

export function SourceCard({ name, platform, region, spend, ctr, conversions, status }: SourceCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:border-primary/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary">{platform}</p>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-xs text-gray-400">{region}</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium capitalize text-primary">{status}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm text-gray-200">
        <div>
          <p className="text-xs text-gray-400">Spend</p>
          <p className="font-semibold">${spend.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">CTR</p>
          <p className="font-semibold">{ctr.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Conversions</p>
          <p className="font-semibold">{conversions}</p>
        </div>
      </div>
    </div>
  );
}
