'use client';

import { useEffect, useRef } from 'react';
import OrderCard from '@/components/orders/OrderCard';
import { useOrders } from '@/components/layout/OrdersContext';
import { useNotifications } from '@/components/layout/NotificationContext';
import AppShell from '@/components/layout/AppShell';

function OrdersContent() {
  const { orders, lastUpdated } = useOrders();
  const { addNotification } = useNotifications();
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current || orders.length === 0) return;
    addNotification({
      type: 'order_started',
      title: 'Orders syncing',
      message: 'Monitoring active campaigns',
    });
    seeded.current = true;
  }, [addNotification, orders.length]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Active Orders</h1>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {lastUpdated ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}` : 'Updating...'}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AppShell>
      <OrdersContent />
    </AppShell>
  );
}
