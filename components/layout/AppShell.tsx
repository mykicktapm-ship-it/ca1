'use client';

import { useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import ModalRoot from './ModalRoot';
import { UIProvider, useUI } from './UIContext';
import WalletAllocationModal from '@/components/modals/WalletAllocationModal';
import NewOrderWizard from '@/components/modals/NewOrderWizard';
import { sources } from '@/lib/mockData';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';

function ShellContent({ children }: { children: React.ReactNode }) {
  const { activeModal, closeModal } = useUI();
  const webApp = useTelegramWebApp();

  useEffect(() => {
    webApp?.expand();
  }, [webApp]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col md:bg-slate-50/80">
          <TopBar />
          <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pb-24 pt-4 sm:px-6 md:pb-6">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
      <ModalRoot activeModal={activeModal}>
        {activeModal === 'walletAllocation' && (
          <WalletAllocationModal sources={sources} onClose={closeModal} />
        )}
        {activeModal === 'newOrder' && <NewOrderWizard onClose={closeModal} />}
      </ModalRoot>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Scroll to top on route change for mini-app experience
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0 });
    }
  }, []);

  return (
    <UIProvider>
      <ShellContent>{children}</ShellContent>
    </UIProvider>
  );
}
