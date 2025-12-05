'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTelegramContext } from '../telegram/TelegramProvider';

type NotificationType = 'order_created' | 'order_started' | 'order_warning' | 'invoice_issued';

type ToastLevel = 'success' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  level: ToastLevel;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (payload: Omit<NotificationItem, 'id' | 'createdAt' | 'read'> & { createdAt?: string }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const baseNotifications: NotificationItem[] = [
  {
    id: 'seed-1',
    type: 'invoice_issued',
    title: 'Invoice issued',
    message: 'New invoice INV-01-5413 is pending payment',
    createdAt: new Date().toISOString(),
    read: false,
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(baseNotifications);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { webApp } = useTelegramContext();

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (window.innerWidth < 768) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(() => undefined);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
      setToasts((prev) => [...prev, { ...toast, id }]);
      const hapticType = toast.level === 'success' ? 'success' : toast.level === 'warning' ? 'warning' : 'error';
      webApp?.HapticFeedback?.notificationOccurred?.(hapticType);

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(toast.title ?? 'Sourceflow', { body: toast.message, silent: true });
      }

      setTimeout(() => dismissToast(id), 3400);
    },
    [dismissToast, webApp]
  );

  const addNotification = useCallback(
    (payload: Omit<NotificationItem, 'id' | 'createdAt' | 'read'> & { createdAt?: string }) => {
      setNotifications((prev) => [
        {
          id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: payload.createdAt ?? new Date().toISOString(),
          read: false,
          ...payload,
        },
        ...prev,
      ]);

      const toastLevel: ToastLevel =
        payload.type === 'order_warning' ? 'warning' : payload.type === 'invoice_issued' ? 'error' : 'success';

      showToast({ level: toastLevel, title: payload.title, message: payload.message });
    },
    [showToast]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo(
    () => ({ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, toasts, showToast, dismissToast }),
    [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, toasts, showToast, dismissToast]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
