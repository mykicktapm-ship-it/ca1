'use client';

import type { ReactNode } from 'react';
import './globals.css';
import { useTelegramWebApp } from '@/lib/useTelegram';
import Link from 'next/link';

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  const { initData } = useTelegramWebApp();

  return (
    <html lang="en">
      <body className="bg-background text-gray-100">
        <div className="min-h-screen">
          <header className="border-b border-white/10 bg-black/30 backdrop-blur">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-lg font-semibold text-primary">
                SOURCEFLOW
              </Link>
              <div className="space-x-4 text-sm text-gray-300">
                <Link href="/">Form</Link>
                <Link href="/pay">Pay</Link>
                <Link href="/stats">Stats</Link>
              </div>
            </div>
          </header>
          <main
            className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8"
            data-telegram-init={initData}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
