'use client';

import { useEffect, useState } from 'react';

type WebAppType = typeof import('@twa-dev/sdk').default | null;

export function useTelegramWebApp() {
  const [webApp, setWebApp] = useState<WebAppType>(null);
  const [initData, setInitData] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { default: sdk } = await import('@twa-dev/sdk');
      if (!mounted) return;
      setWebApp(sdk);
      setInitData(sdk.initData || '');
      try {
        sdk.ready();
        sdk.expand();
      } catch (err) {
        console.warn('Failed to init Telegram WebApp SDK', err);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return { webApp, initData };
}
