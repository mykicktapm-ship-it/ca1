'use client';

import Link from 'next/link';
import { useEffect, type ReactNode } from 'react';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';

export default function AppShell({ children }: { children: ReactNode }) {
  const { initData } = useTelegramInitData();

  useEffect(() => {
    const body = typeof document !== 'undefined' ? document.body : null;

    if (body && initData) {
      body.dataset.telegramInit = initData;
    }

    return () => {
      if (body && body.dataset.telegramInit === initData) {
        delete body.dataset.telegramInit;
      }
    };
  }, [initData]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto flex min-h-screen max-w-[520px] flex-col px-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <header
          className="sticky top-0 z-20 -mx-4 mb-4 border-b border-[var(--border)]/70 bg-[#0f1118]/80 px-4 pb-3 pt-4 backdrop-blur"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary)] shadow-[0_10px_30px_rgba(90,99,255,0.18)]">
                SF
              </span>
              <div className="leading-tight">
                <Link href="/" className="block text-lg font-semibold tracking-tight">
                  SOURCEFLOW
                </Link>
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Traffic Arbitration Desk</p>
              </div>
            </div>
            <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Link
                href="/"
                className="rounded-full border border-transparent px-3 py-1.5 transition hover:border-[var(--border)] hover:text-white"
              >
                Заявка
              </Link>
              <Link
                href="/pay"
                className="rounded-full border border-transparent px-3 py-1.5 transition hover:border-[var(--border)] hover:text-white"
              >
                Оплата
              </Link>
              <Link
                href="/stats"
                className="rounded-full border border-transparent px-3 py-1.5 transition hover:border-[var(--border)] hover:text-white"
              >
                Статус
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 pb-10">{children}</main>
      </div>
    </div>
  );
}
