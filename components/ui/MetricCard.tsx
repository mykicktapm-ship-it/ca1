'use client';

import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="space-y-2 rounded-2xl border border-[var(--border)] bg-[#0f1118] p-4 shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</p>
      <div className="text-2xl font-semibold text-white">{value}</div>
      {hint && <p className="text-sm text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}
