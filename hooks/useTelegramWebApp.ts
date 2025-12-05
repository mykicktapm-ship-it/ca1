'use client';

import { useEffect, useState } from 'react';
import { initializeTelegramWebApp, type TelegramWebApp } from '@/lib/telegram';

export function useTelegramWebApp() {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    let mounted = true;

    initializeTelegramWebApp().then((webApp) => {
      if (!mounted || !webApp) return;

      webApp.ready?.();
      webApp.expand?.();
      const theme = webApp.themeParams;
      const bgColor = theme?.bg_color ?? '#f5f7fb';

      if (webApp.setHeaderColor) {
        webApp.setHeaderColor(theme?.header_color ?? bgColor);
      }
      if (webApp.setBackgroundColor) {
        webApp.setBackgroundColor(bgColor);
      }

      setTg(webApp);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return tg;
}
