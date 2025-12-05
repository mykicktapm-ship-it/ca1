'use client';

import type { ReactNode } from 'react';

interface FormCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  subtle?: boolean;
}

export function FormCard({ title, description, action, children, subtle }: FormCardProps) {
  return (
    <section
      className={`space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 p-4 shadow-[0_20px_45px_rgba(0,0,0,0.35)] ${
        subtle ? 'bg-[var(--surface)]/70' : ''
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{title}</p>
          {description && <p className="text-sm text-[var(--text-muted)]">{description}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
