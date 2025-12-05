'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/wallet', label: 'Wallet', icon: 'account_balance_wallet' },
  { href: '/orders', label: 'Orders', icon: 'list_alt' },
  { href: '/history', label: 'History', icon: 'history' },
  { href: '/finance', label: 'Finance', icon: 'receipt_long' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white shadow-[0_-8px_30px_rgba(15,23,42,0.1)] md:hidden pb-safe">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-2 py-2 text-xs font-medium text-slate-500">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1 ${
                active ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-rounded text-2xl">{item.icon}</span>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
