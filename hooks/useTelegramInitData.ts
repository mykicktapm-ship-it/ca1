'use client';

import { useEffect, useState } from 'react';
import { useTelegramWebApp } from './useTelegramWebApp';

interface TelegramInitData {
  webApp: ReturnType<typeof useTelegramWebApp>;
  initData: string;
}

export function useTelegramInitData(): TelegramInitData {
  const webApp = useTelegramWebApp();
  const [initData, setInitData] = useState('');

  useEffect(() => {
    if (!webApp?.initData) return;

    setInitData(webApp.initData);
  }, [webApp]);

  return { webApp, initData };
}
