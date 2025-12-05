'use client';

import OrderCard from '@/components/orders/OrderCard';
import { orders } from '@/lib/mockData';

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Active Orders</h1>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Updated hourly</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
