'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ActiveModal = 'newOrder' | 'walletAllocation' | null;

interface UIContextValue {
  activeModal: ActiveModal;
  openNewOrder: () => void;
  openWalletAllocation: () => void;
  closeModal: () => void;
}

const UIContext = createContext<UIContextValue | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const openNewOrder = useCallback(() => setActiveModal('newOrder'), []);
  const openWalletAllocation = useCallback(() => setActiveModal('walletAllocation'), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const value = useMemo(
    () => ({ activeModal, openNewOrder, openWalletAllocation, closeModal }),
    [activeModal, openNewOrder, openWalletAllocation, closeModal]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
