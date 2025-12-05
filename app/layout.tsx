import type { ReactNode } from 'react';
import Script from 'next/script';
import './globals.css';
import AppShell from '@/components/layout/AppShell';

export const metadata = {
  title: 'SOURCEFLOW',
  description: 'SOURCEFLOW dashboard mini app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Material+Symbols+Rounded:wght@400;500;600&display=swap"
        />
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="bg-[var(--bg)] text-slate-900 antialiased pt-safe">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
