'use client';

import { useState } from 'react';
import type { Source } from '@/lib/mockData';

interface WalletAllocationModalProps {
  sources: Source[];
  onClose: () => void;
}

export default function WalletAllocationModal({ sources, onClose }: WalletAllocationModalProps) {
  const [allocations, setAllocations] = useState<Record<string, number>>(
    () => Object.fromEntries(sources.map((s) => [s.id, s.allocated]))
  );

  const unallocated = Math.max(0, 20000 - Object.values(allocations).reduce((sum, val) => sum + val, 0));

  return (
    <div className="w-full max-w-xl rounded-3xl bg-white p-4 shadow-2xl md:p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900">Wallet Allocation</p>
          <p className="text-sm text-slate-500">Distribute balance across sources.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          Unallocated: ${unallocated.toLocaleString()}
        </div>
      </div>
      <div className="space-y-4">
        {sources.map((source) => {
          const value = allocations[source.id];
          const pct = Math.min(100, Math.round((source.spent / value) * 100));
          return (
            <div key={source.id} className="rounded-2xl border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${source.color}`}>
                    {source.logo}
                  </div>
                  <div className="leading-tight">
                    <p className="font-semibold text-slate-900">{source.name}</p>
                    <p className="text-xs text-slate-500">Allocated ${value.toLocaleString()}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-600">Active</span>
              </div>
              <div className="mt-3 space-y-2">
                <input
                  type="range"
                  min={500}
                  max={8000}
                  value={value}
                  onChange={(e) => setAllocations((prev) => ({ ...prev, [source.id]: Number(e.target.value) }))}
                  className="w-full accent-indigo-600"
                />
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-indigo-600" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Spent ${source.spent.toLocaleString()}</span>
                  <span>{pct}% of allocation</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-end gap-3">
        <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
          Close
        </button>
        <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20">
          Save Allocation
        </button>
      </div>
    </div>
  );
}
