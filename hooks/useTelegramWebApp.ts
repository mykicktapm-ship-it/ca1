'use client';

import { useEffect, useState } from 'react';
import { initializeTelegramWebApp, type TelegramWebApp } from '@/lib/telegram';

export function useTelegramWebApp() {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    let mounted = true;

    initializeTelegramWebApp().then((webApp) => {
      if (!mounted) return;
      setTg(webApp);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return tg;
}
