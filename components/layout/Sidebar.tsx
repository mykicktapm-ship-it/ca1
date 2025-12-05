'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useUI } from './UIContext';

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/wallet', label: 'Source Wallet', icon: 'account_balance_wallet' },
  { href: '/orders', label: 'Active Orders', icon: 'list_alt' },
  { href: '/history', label: 'History', icon: 'history' },
  { href: '/finance', label: 'Finance', icon: 'receipt_long' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { openNewOrder } = useUI();
  const active = useMemo(() => navItems.find((item) => item.href === pathname)?.href, [pathname]);

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col justify-between bg-slate-900 text-white md:flex">
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold">S</div>
          <div>
            <p className="text-lg font-semibold">SOURCEFLOW</p>
            <p className="text-xs text-slate-400">Cabinet</p>
          </div>
        </div>
        <nav className="space-y-1 text-sm">
          {navItems.map((item) => {
            const isActive = active === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-800 ${
                  isActive ? 'bg-slate-800 text-white' : 'text-slate-300'
                }`}
              >
                <span className="material-symbols-rounded text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="space-y-4 p-6">
        <button
          onClick={openNewOrder}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500"
        >
          <span className="material-symbols-rounded text-base">add</span>
          NEW ORDER
        </button>
        <div className="flex items-center gap-3 rounded-xl bg-slate-800/80 p-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
          <div className="leading-tight">
            <p className="text-sm font-semibold">Alex Stone</p>
            <p className="text-xs text-slate-300">Premium Partner</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
