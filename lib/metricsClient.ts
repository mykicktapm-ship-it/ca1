import { orders as seedOrders, type Order } from './mockData';

export async function fetchDashboardMetrics() {
  // TODO: replace with real API call
  return Promise.resolve({
    balance: 14250,
    allocated: 12400,
    spent: 6800,
    activeOrders: 12,
    roi: 142,
  });
}

export async function fetchOrdersMetrics(currentOrders: Order[] = seedOrders) {
  const updated = currentOrders.map((order, idx) => ({
    ...order,
    metrics: {
      ...order.metrics,
      spend: order.metrics.spend + (idx + 1) * 5,
    },
  }));

  return Promise.resolve({ orders: updated, updatedAt: new Date().toISOString() });
}

export async function fetchSourceWalletMetrics() {
  return Promise.resolve({
    balance: 14250,
    allocated: 12400,
    spent: 6800,
  });
}
