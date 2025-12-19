'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/wallet', label: 'Source Wallet', icon: 'account_balance_wallet' },
  { href: '/orders', label: 'Orders', icon: 'list_alt' },
  { href: '/history', label: 'History', icon: 'history' },
  { href: '/terminal', label: 'Terminal', icon: 'terminal' },
  { href: '/finance', label: 'Finance', icon: 'receipt_long' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.1)] backdrop-blur md:hidden pb-safe">
      <div className="mx-auto flex max-w-xl items-center justify-between px-2 py-2 text-xs font-medium text-slate-500">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-all duration-200 ${
                active ? 'text-indigo-600' : 'text-slate-500'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <div
                className={`absolute inset-x-1 -z-10 rounded-2xl bg-indigo-50 opacity-0 transition duration-200 ${
                  active ? 'opacity-100 shadow-inner shadow-indigo-100' : 'group-hover:opacity-70'
                }`}
              />
              <span className={`material-symbols-rounded text-2xl transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
                {item.icon}
              </span>
              <span className="text-[11px] font-semibold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
