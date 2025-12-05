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
import { useTelegramContext } from '../telegram/TelegramProvider';
import { NotificationProvider } from './NotificationContext';
import { OrdersProvider } from './OrdersContext';
import { TelegramProvider } from '../telegram/TelegramProvider';
import { TonConnectProvider } from '../ton/TonConnectProvider';
import NotificationsRoot from './NotificationsRoot';

function ShellContent({ children }: { children: React.ReactNode }) {
  const { activeModal, closeModal } = useUI();
  const { webApp } = useTelegramContext();

  useEffect(() => {
    if (!webApp) return;
    webApp.expand();
    const theme = webApp.themeParams;
    if (theme) {
      document.documentElement.style.setProperty('--bg', theme.bg_color ?? '#f5f7fb');
      document.documentElement.style.setProperty('--surface', theme.secondary_bg_color ?? '#ffffff');
      document.documentElement.style.setProperty('--slate', theme.text_color ?? '#0f172a');
    }
  }, [webApp]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col md:bg-slate-50/80">
          <TopBar />
          <main className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-3 pb-32 pt-3 sm:px-5 md:max-w-5xl md:gap-6 md:pb-10 md:pt-6">
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
      <NotificationsRoot />
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
    <TelegramProvider>
      <TonConnectProvider>
        <NotificationProvider>
          <OrdersProvider>
            <UIProvider>
              <ShellContent>{children}</ShellContent>
            </UIProvider>
          </OrdersProvider>
        </NotificationProvider>
      </TonConnectProvider>
    </TelegramProvider>
  );
}
