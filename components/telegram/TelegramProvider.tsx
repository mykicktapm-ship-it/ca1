'use client';

import { createContext, useContext, useMemo } from 'react';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';

interface TelegramContextValue {
  webApp: ReturnType<typeof useTelegramWebApp>;
  user?: {
    id?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
  };
}

const TelegramContext = createContext<TelegramContextValue | undefined>(undefined);

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const webApp = useTelegramWebApp();
  const value = useMemo(() => ({ webApp, user: webApp?.initDataUnsafe?.user }), [webApp]);

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}

export function useTelegramContext() {
  const ctx = useContext(TelegramContext);
  if (!ctx) throw new Error('useTelegramContext must be used within TelegramProvider');
  return ctx;
}
