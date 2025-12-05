'use client';

import { useEffect, useState } from 'react';

export function useTelegramWebApp() {
  const [tg, setTg] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    (async () => {
      try {
        const { default: WebApp } = await import('@twa-dev/sdk');

        const app = WebApp;
        app.ready();
        app.expand();

        setTg(app);
      } catch (err) {
        console.error('Telegram WebApp init failed', err);
      }
    })();
  }, []);

  return tg;
}
