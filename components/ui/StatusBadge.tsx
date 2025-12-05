'use client';

interface StatusBadgeProps {
  status: string;
}

const statusColors: Record<string, string> = {
  new: '#38BDF8',
  paid: '#5A63FF',
  in_progress: '#4BD8A2',
  completed: '#F5A623'
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = statusColors[status] || '#5A63FF';
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold capitalize"
      style={{ color, backgroundColor: 'rgba(255,255,255,0.04)' }}
    >
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {status.replace('_', ' ')}
    </span>
  );
}
