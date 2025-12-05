'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useUI } from './UIContext';
import NotificationDropdown from './NotificationDropdown';
import TonConnectButton from '../ton/TonConnectButton';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/wallet': 'Wallet',
  '/orders': 'Orders',
  '/history': 'History',
  '/finance': 'Finance',
};

export default function TopBar() {
  const pathname = usePathname();
  const { openNewOrder } = useUI();
  const title = useMemo(() => titles[pathname] || 'SOURCEFLOW', [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 pb-1 pt-safe backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-3 sm:px-6">
        <div className="flex flex-1 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30">
            S
          </div>
          <div className="leading-tight">
            <p className="text-lg font-semibold text-slate-900">{title}</p>
            <p className="hidden text-xs text-slate-500 sm:block">SOURCEFLOW control center</p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> System Operational
          </span>
          <TonConnectButton />
          <NotificationDropdown />
          <button
            onClick={openNewOrder}
            className="hidden items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 md:inline-flex"
          >
            <span className="material-symbols-rounded text-base">add</span>
            NEW ORDER
          </button>
          <button
            onClick={openNewOrder}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 md:hidden"
            aria-label="Create new order"
          >
            <span className="material-symbols-rounded">add</span>
          </button>
        </div>
      </div>
    </header>
  );
}
