'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { orders as seedOrders, type Order } from '@/lib/mockData';
import { fetchOrdersMetrics } from '@/lib/metricsClient';

interface OrdersContextValue {
  orders: Order[];
  lastUpdated?: string;
  addOrder: (order: Order) => void;
  refreshOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();
  const isRefreshing = useRef(false);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setLastUpdated(new Date().toISOString());
  }, []);

  const refreshOrders = useCallback(async () => {
    if (isRefreshing.current) return;
    isRefreshing.current = true;
    try {
      const response = await fetchOrdersMetrics(orders);
      if (response?.orders) {
        setOrders(response.orders);
      }
      setLastUpdated(response.updatedAt ?? new Date().toISOString());
    } finally {
      isRefreshing.current = false;
    }
  }, [orders]);

  useEffect(() => {
    refreshOrders();
    const interval = setInterval(() => {
      // TODO: switch to long interval (e.g., every 6h) after backend is wired
      refreshOrders();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  const value = useMemo(
    () => ({ orders, addOrder, refreshOrders, lastUpdated }),
    [orders, addOrder, refreshOrders, lastUpdated]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
