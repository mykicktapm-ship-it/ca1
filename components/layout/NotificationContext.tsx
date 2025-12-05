'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type NotificationType = 'order_created' | 'order_started' | 'order_warning' | 'invoice_issued';

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
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo(
    () => ({ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }),
    [notifications, unreadCount, addNotification, markAsRead, markAllAsRead]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
