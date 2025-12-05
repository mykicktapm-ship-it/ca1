import type { ReactNode } from 'react';
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
      </head>
      <body className="bg-[var(--bg)] text-slate-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
