'use client';

import Link from 'next/link';
import { useEffect, type ReactNode } from 'react';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';

function BellIcon() {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5s1.5-1.5 1.5-5.5" />
      <path d="M9.75 18.5a2.25 2.25 0 0 0 4.5 0" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3-3" />
    </svg>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { webApp, initData } = useTelegramInitData();

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

  const userName =
    webApp?.initDataUnsafe?.user?.first_name || webApp?.initDataUnsafe?.user?.username;
  const avatarInitial = userName?.charAt(0).toUpperCase() || 'S';

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <header
        className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight text-primary">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">
              SF
            </span>
            <span className="leading-none">SOURCEFLOW</span>
          </Link>

          <div className="hidden flex-1 items-center sm:flex">
            <label className="sr-only" htmlFor="global-search">
              Search
            </label>
            <div className="flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white shadow-inner shadow-black/20">
              <SearchIcon />
              <input
                id="global-search"
                placeholder="Search campaigns, payments, stats"
                className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-200 shadow-lg shadow-black/30 transition hover:border-primary/40 hover:text-white"
              aria-label="View notifications"
            >
              <BellIcon />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-primary/20 to-white/5 text-sm font-semibold uppercase text-white shadow-lg shadow-black/30">
              {avatarInitial}
            </div>
          </div>
        </div>
        <div className="px-4 pb-3 sm:hidden">
          <label className="sr-only" htmlFor="global-search-mobile">
            Search
          </label>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white shadow-inner shadow-black/20">
            <SearchIcon />
            <input
              id="global-search-mobile"
              placeholder="Search"
              className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
              autoComplete="off"
            />
          </div>
        </div>
      </header>

      <main
        className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8"
        data-telegram-init={initData}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {children}
      </main>
    </div>
  );
}
