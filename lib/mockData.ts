export type SourceStatus = 'active' | 'paused';

export interface Source {
  id: string;
  name: string;
  logo: string;
  allocated: number;
  spent: number;
  status: SourceStatus;
  color: string;
}

export interface OrderMetrics {
  spend: number;
  leads: number;
  cpa: number;
  budget: number;
}

export type OrderStatus = 'active' | 'warning' | 'review';

export interface Order {
  id: string;
  name: string;
  geo: string;
  source: string;
  metrics: OrderMetrics;
  status: OrderStatus;
}

export type InvoiceStatus = 'paid' | 'pending' | 'draft';

export interface Invoice {
  id: string;
  amount: number;
  date: string;
  status: InvoiceStatus;
}

export const sources: Source[] = [
  {
    id: 'google',
    name: 'Google Ads',
    logo: 'G',
    allocated: 5200,
    spent: 3800,
    status: 'active',
    color: 'bg-red-500',
  },
  {
    id: 'meta',
    name: 'Meta',
    logo: 'M',
    allocated: 4500,
    spent: 2400,
    status: 'active',
    color: 'bg-blue-500',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    logo: 'TT',
    allocated: 3200,
    spent: 1800,
    status: 'active',
    color: 'bg-black',
  },
  {
    id: 'yandex',
    name: 'Yandex',
    logo: 'Y',
    allocated: 2600,
    spent: 900,
    status: 'active',
    color: 'bg-amber-500',
  },
];

export const orders: Order[] = [
  {
    id: 'ORD-12451',
    name: 'Crypto Wallet UA',
    geo: 'UA',
    source: 'Google',
    metrics: { spend: 1450, leads: 86, cpa: 16.8, budget: 3200 },
    status: 'active',
  },
  {
    id: 'ORD-12452',
    name: 'E-comm Flash Sale',
    geo: 'PL',
    source: 'Meta',
    metrics: { spend: 980, leads: 64, cpa: 15.3, budget: 2600 },
    status: 'review',
  },
  {
    id: 'ORD-12453',
    name: 'Mobile VPN',
    geo: 'BR',
    source: 'TikTok',
    metrics: { spend: 620, leads: 32, cpa: 19.4, budget: 1800 },
    status: 'warning',
  },
];

export const invoices: Invoice[] = [
  { id: 'INV-01-5412', amount: 5000, date: '2024-05-04', status: 'paid' },
  { id: 'INV-01-5413', amount: 3500, date: '2024-05-12', status: 'pending' },
  { id: 'INV-01-5414', amount: 2400, date: '2024-06-01', status: 'draft' },
];
