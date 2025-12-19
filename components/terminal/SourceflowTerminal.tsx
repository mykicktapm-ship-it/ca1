'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Bitcoin,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Crosshair,
  DollarSign,
  Filter,
  Globe,
  Grid,
  Layers,
  LayoutDashboard,
  List,
  MousePointer2,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sliders,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

type Tab = 'dashboard' | 'sources' | 'market' | 'campaigns' | 'profile';
type WizardStep = 1 | 2 | 3 | 4;
type CampaignStatus = 'active' | 'paused' | 'banned' | 'learning';
type MarketCategory = 'facebook' | 'google' | 'tiktok' | 'proxy' | 'bm';

type MarketItem = {
  id: string;
  category: MarketCategory;
  title: string;
  geo: string;
  tags: string[];
  price: number;
  stock: number;
  supplier: string;
  trust_score: number;
};

type SourceStats = {
  id: string;
  name: string;
  color: string;
  financials: { spend: number; revenue: number; profit: number; roi: number };
  metrics: { cpi: number; ir: number; ecpm: number };
};

type Campaign = {
  id: number;
  name: string;
  vertical: string;
  status: CampaignStatus;
  roi: number;
  spend: number;
  revenue: number;
  source: string;
};

type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string; sub?: string };

type NicheTargeting = Record<
  string,
  {
    goals: string[];
    segments: string[];
    tech: string[];
  }
>;

const NICHE_TARGETING: NicheTargeting = {
  Gambling: {
    goals: ['First Deposit (FTD)', 'Registration (CPL)', 'App Install (CPI)', 'Qualified Player', 'Redeposit (Retention)'],
    segments: [
      'High Rollers (VIP)',
      'Slots Enthusiasts',
      'Sports Bettors',
      'Risk Takers',
      'Competitor Users',
      'Late Night Active',
      'Casino Stream Viewers',
      'Payday Loan Users',
    ],
    tech: ['High-End Devices Only', 'WiFi Connection (Heavy Assets)', 'Carrier Billing Support', 'No Root/Jailbreak'],
  },
  Crypto: {
    goals: ['Lead (Phone Verified)', 'Deposit ($250+)', 'Call Center Callback', 'KYC Passed', 'Active Trader'],
    segments: [
      'Investors / Stocks',
      'Business Owners / CEOs',
      'Luxury Lifestyle',
      'FinTech Users',
      'Passive Income Seekers',
      'Crypto Wallet Holders',
      'Forex Interested',
      'High Net Worth',
    ],
    tech: ['Desktop Priority', 'Latest iOS Versions', 'High Income Zip Codes', 'Exclude Low-End Android'],
  },
  Nutra: {
    goals: ['COD Confirmation (Approve)', 'Straight Sale (SS)', 'Trial Order', 'Upsell Conversion', 'Rebill'],
    segments: [
      'Weight Loss Interest',
      "Anti-Aging / Skincare",
      "Men's Health (40+)",
      'Home Remedies / DIY',
      'Natural Supplements',
      'Fitness Beginners',
      'Post-Pregnancy',
      'Chronic Pain Relief',
    ],
    tech: ['Native Ads Placements', 'News Portal Inventory', 'Mobile Web Optimization', 'Older OS Allowed'],
  },
  Dating: {
    goals: ['DOI (Double Opt-In)', 'SOI (Single Opt-In)', 'Credit Purchase', 'Subscription Trial', 'App Install'],
    segments: [
      'Singles / Active',
      'Social App Users',
      'Nightlife / Clubbing',
      'Casual Gaming',
      'Travelers / Expats',
      'Lookalike Paid Users',
      'Chat App Users',
      'Local Matching',
    ],
    tech: ['Mobile App Traffic', 'Carrier Targeting (WAP)', 'Click2SMS Support', '3G/4G/5G Preferred'],
  },
};

const INITIAL_MARKET_ITEMS: MarketItem[] = [
  { id: 'fb-1', category: 'facebook', title: 'FB King | UA | PZRD', geo: 'UA', tags: ['PZRD', 'Limit $250', 'Token+Cookie'], price: 12.5, stock: 42, supplier: 'FarmGods', trust_score: 10 },
  { id: 'fb-2', category: 'facebook', title: 'FB Autoreg | US | Mix', geo: 'US', tags: ['Autoreg', 'SMS Verified'], price: 1.2, stock: 1500, supplier: 'AutoFarm', trust_score: 8 },
  { id: 'bm-1', category: 'bm', title: 'BM 250$ | Verified', geo: 'DE', tags: ['Verified', 'Old Date'], price: 45, stock: 5, supplier: 'BMMaster', trust_score: 9 },
  { id: 'gl-1', category: 'google', title: 'Google Ads | Threshold 300$', geo: 'BR', tags: ['Threshold', 'Old Mail'], price: 25, stock: 12, supplier: 'G-Store', trust_score: 9 },
  { id: 'pr-1', category: 'proxy', title: 'Mobile Proxy | USA | AT&T', geo: 'US', tags: ['Mobile', 'Rotation', '4G'], price: 55, stock: 99, supplier: 'ProxyHub', trust_score: 10 },
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 492, name: 'Crypto Gen - DE', vertical: 'Crypto', status: 'active', roi: 145, spend: 450, revenue: 1102, source: 'Meta Ads' },
  { id: 493, name: 'Nutra Slim - IT', vertical: 'Nutra', status: 'learning', roi: -12, spend: 120, revenue: 105, source: 'TikTok' },
  { id: 488, name: 'Casino Vulkan - BR', vertical: 'Gambling', status: 'banned', roi: -100, spend: 80, revenue: 0, source: 'Google Ads' },
];

const INITIAL_SOURCES: SourceStats[] = [
  { id: 'meta', name: 'Meta Ads', color: 'bg-blue-600 text-white', financials: { spend: 24500, revenue: 52100, profit: 27600, roi: 112.6 }, metrics: { cpi: 0.7, ir: 1.1, ecpm: 16.2 } },
  { id: 'google', name: 'Google Ads', color: 'bg-red-500 text-white', financials: { spend: 18200, revenue: 22400, profit: 4200, roi: 23.1 }, metrics: { cpi: 1.5, ir: 0.9, ecpm: 14.5 } },
  { id: 'tiktok', name: 'TikTok', color: 'bg-black text-white', financials: { spend: 15000, revenue: 14200, profit: -800, roi: -5.3 }, metrics: { cpi: 0.83, ir: 0.3, ecpm: 2.5 } },
  { id: 'unity', name: 'Unity Ads', color: 'bg-zinc-100 text-black', financials: { spend: 12400, revenue: 16800, profit: 4400, roi: 35.4 }, metrics: { cpi: 1.03, ir: 0.8, ecpm: 11.2 } },
  { id: 'applovin', name: 'AppLovin', color: 'bg-orange-500 text-white', financials: { spend: 8500, revenue: 11200, profit: 2700, roi: 31.7 }, metrics: { cpi: 1.1, ir: 0.95, ecpm: 12.8 } },
  { id: 'mintegral', name: 'Mintegral', color: 'bg-green-600 text-white', financials: { spend: 6200, revenue: 8100, profit: 1900, roi: 30.6 }, metrics: { cpi: 0.65, ir: 0.7, ecpm: 8.4 } },
  { id: 'ironsource', name: 'IronSource', color: 'bg-indigo-900 text-white', financials: { spend: 5400, revenue: 4800, profit: -600, roi: -11.1 }, metrics: { cpi: 1.2, ir: 0.6, ecpm: 9.5 } },
  { id: 'vungle', name: 'Vungle', color: 'bg-purple-600 text-white', financials: { spend: 3100, revenue: 3900, profit: 800, roi: 25.8 }, metrics: { cpi: 0.9, ir: 0.75, ecpm: 7.9 } },
  { id: 'snapchat', name: 'Snapchat', color: 'bg-yellow-400 text-black', financials: { spend: 2800, revenue: 2100, profit: -700, roi: -25 }, metrics: { cpi: 2.1, ir: 0.2, ecpm: 4.2 } },
  { id: 'twitter', name: 'X (Twitter)', color: 'bg-zinc-800 text-white', financials: { spend: 1500, revenue: 1800, profit: 300, roi: 20 }, metrics: { cpi: 1.8, ir: 0.4, ecpm: 6.5 } },
  { id: 'pinterest', name: 'Pinterest', color: 'bg-red-700 text-white', financials: { spend: 900, revenue: 1100, profit: 200, roi: 22.2 }, metrics: { cpi: 1.4, ir: 0.5, ecpm: 5.1 } },
];

const PNL_DATA_24H = [
  { time: '00:00', profit: 120, spend: 80 },
  { time: '04:00', profit: 150, spend: 90 },
  { time: '08:00', profit: 320, spend: 150 },
  { time: '12:00', profit: 450, spend: 200 },
  { time: '16:00', profit: 410, spend: 240 },
  { time: '20:00', profit: 580, spend: 280 },
  { time: '23:59', profit: 620, spend: 310 },
];

const ToastContainer = ({ toasts }: { toasts: Toast[] }) => (
  <div className="pointer-events-none fixed left-1/2 top-4 z-[60] w-[90%] max-w-sm -translate-x-1/2 space-y-2">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/95 px-4 py-3 text-white shadow-2xl"
      >
        {toast.type === 'success' ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : toast.type === 'error' ? (
          <AlertTriangle className="h-5 w-5 text-rose-500" />
        ) : (
          <Activity className="h-5 w-5 text-indigo-400" />
        )}
        <div className="flex-1 text-left">
          <p className="text-sm font-medium leading-tight">{toast.message}</p>
          {toast.sub && <p className="text-xs text-zinc-400">{toast.sub}</p>}
        </div>
      </div>
    ))}
  </div>
);

const GeoFlag = ({ code }: { code: string }) => (
  <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-700 text-[10px] font-bold text-white">
    {code}
  </div>
);

const StatusBadge = ({ status }: { status: CampaignStatus }) => {
  const styles: Record<CampaignStatus, string> = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    learning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    paused: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    banned: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function SourceflowTerminal() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showWizard, setShowWizard] = useState(false);
  const [userBalance, setUserBalance] = useState(42850);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [myAssets, setMyAssets] = useState<MarketItem[]>([]);
  const [sources, setSources] = useState<SourceStats[]>(INITIAL_SOURCES);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [wizardData, setWizardData] = useState({
    vertical: '',
    source: 'Meta Ads',
    assetId: '',
    budget: 1000,
    budgetType: 'Daily',
    bidStrategy: 'Lowest Cost',
    bidCapValue: 0,
    pacing: 'Accelerated',
    optimizationEvent: '',
    selectedSegments: [] as string[],
    selectedTech: [] as string[],
    ageRange: [18, 65],
  });
  const [activeModal, setActiveModal] = useState<'purchase' | 'asset_detail' | null>(null);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      addToast('info', 'Добро пожаловать', 'Телеграм-режим синхронизирован');
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToast = (type: Toast['type'], message: string, sub?: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message, sub }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  };

  const toggleSegment = (segment: string) => {
    setWizardData((prev) => {
      const exists = prev.selectedSegments.includes(segment);
      return {
        ...prev,
        selectedSegments: exists ? prev.selectedSegments.filter((s) => s !== segment) : [...prev.selectedSegments, segment],
      };
    });
  };

  const toggleTech = (tech: string) => {
    setWizardData((prev) => {
      const exists = prev.selectedTech.includes(tech);
      return {
        ...prev,
        selectedTech: exists ? prev.selectedTech.filter((t) => t !== tech) : [...prev.selectedTech, tech],
      };
    });
  };

  const handleInitiatePurchase = (item: MarketItem) => {
    setSelectedItem(item);
    setActiveModal('purchase');
  };

  const confirmPurchase = (qty: number) => {
    if (!selectedItem) return;
    const cost = selectedItem.price * qty;

    if (userBalance >= cost) {
      setUserBalance((prev) => prev - cost);
      const newAssets = Array.from({ length: qty }).map((_, i) => ({
        ...selectedItem,
        id: `${selectedItem.id}_${Date.now()}_${i}`,
      }));
      setMyAssets((prev) => [...prev, ...newAssets]);
      addToast('success', 'Покупка успешна', `Куплено ${qty} шт. ${selectedItem.title}`);
      setActiveModal(null);
    } else {
      addToast('error', 'Ошибка транзакции', 'Недостаточно средств на балансе');
    }
  };

  const toggleCampaignStatus = (id: number) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus: CampaignStatus = c.status === 'active' ? 'paused' : 'active';
          addToast('info', `Кампания #${id} обновлена`, `Статус: ${newStatus.toUpperCase()}`);
          return { ...c, status: newStatus };
        }
        return c;
      }),
    );
  };

  const scaleCampaign = (id: number) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          addToast('success', 'Бюджет увеличен', `Кампания #${id}: +20% к спенду`);
          return { ...c, spend: Math.floor(c.spend * 1.2) };
        }
        return c;
      }),
    );
  };

  const handleLaunchCampaign = () => {
    setShowWizard(false);

    const newCampaign: Campaign = {
      id: Math.floor(Math.random() * 10000),
      name: `${wizardData.vertical} Offer - ${new Date().toLocaleDateString()}`,
      vertical: wizardData.vertical,
      status: 'learning',
      roi: 0,
      spend: 0,
      revenue: 0,
      source: wizardData.source,
    };

    setTimeout(() => {
      setCampaigns((prev) => [newCampaign, ...prev]);
      setUserBalance((prev) => prev - wizardData.budget);
      setActiveTab('campaigns');
      addToast('success', 'Кампания запущена!', `Бюджет $${wizardData.budget} зарезервирован.`);
      setWizardStep(1);
      setWizardData((prev) => ({ ...prev, vertical: '', assetId: '', budget: 1000 }));
    }, 800);
  };

  const handleSortSources = (key: keyof SourceStats['financials']) => {
    const sorted = [...sources].sort((a, b) => b.financials[key] - a.financials[key]);
    setSources(sorted);
    addToast('info', 'Таблица обновлена', `Сортировка по: ${key.toUpperCase()}`);
  };

  const DashboardView = () => (
    <div className="space-y-6 pb-4">
      <div className="rounded-3xl border border-zinc-900 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5 shadow-xl shadow-indigo-500/10">
        <div className="mb-4 flex items-end justify-between">
          <div
            onClick={() => addToast('info', 'История транзакций', 'Открывается модальное окно...')}
            className="cursor-pointer active:opacity-70"
          >
            <span className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-zinc-500">
              Общий Баланс <ChevronRight className="h-3 w-3" />
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold tracking-tight text-white">{formatCurrency(userBalance)}</h1>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div
              className="mb-1 flex items-center gap-1.5 rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-1"
              onClick={() => addToast('success', 'Аналитика', 'ROI вырос на 12% за последние 4 часа')}
            >
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">ROI +142%</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">LIVE 24H</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-800/60 px-4 py-2">
            <span className="text-xs font-medium text-zinc-400">Profit & Loss</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToast('info', 'AI Analyst', 'Анализирую тренды...');
              }}
              className="flex items-center gap-1 rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 text-[10px] font-bold text-indigo-400"
            >
              <Sparkles className="h-3 w-3" /> AI Insight
            </button>
          </div>
          <div className="h-44 w-full" onClick={() => addToast('info', 'Детализация', 'График развернут на весь экран')}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PNL_DATA_24H}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => {
            setActiveTab('campaigns');
            addToast('info', 'Фильтр', 'Показаны активные кампании');
          }}
          className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4 shadow-lg shadow-black/20 transition hover:border-zinc-700"
        >
          <div className="mb-2 flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            <span className="text-xs text-zinc-400">Active Ads</span>
          </div>
          <p className="text-2xl font-mono font-bold text-white">{campaigns.filter((c) => c.status === 'active').length}</p>
        </div>
        <div
          onClick={() => {
            setActiveTab('campaigns');
            addToast('info', 'Фильтр', 'Показаны проблемные кампании');
          }}
          className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4 shadow-lg shadow-black/20 transition hover:border-zinc-700"
        >
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            <span className="text-xs text-zinc-400">Issues</span>
          </div>
          <p className="text-2xl font-mono font-bold text-rose-500">{campaigns.filter((c) => c.status === 'banned').length}</p>
        </div>
      </div>
    </div>
  );

  const MarketView = () => {
    const [filterCategory, setFilterCategory] = useState<'all' | MarketCategory>('all');
    const [viewMode, setViewMode] = useState<'shop' | 'assets'>('shop');

    const filteredItems = INITIAL_MARKET_ITEMS.filter((i) => {
      const matchCat = filterCategory === 'all' || i.category === filterCategory;
      const matchSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    return (
      <div className="space-y-4 pb-6">
        <div className="sticky top-0 z-10 -mx-2 bg-zinc-950/80 px-2 pb-2 pt-2 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
              <ShoppingBag className="h-6 w-6 text-indigo-500" /> Market
            </h1>
            <div className="flex rounded-lg border border-zinc-800 bg-zinc-900 p-1 text-xs font-bold">
              <button
                onClick={() => setViewMode('shop')}
                className={`rounded px-3 py-1 transition-colors ${viewMode === 'shop' ? 'bg-indigo-600 text-white' : 'text-zinc-500'}`}
              >
                Store
              </button>
              <button
                onClick={() => setViewMode('assets')}
                className={`rounded px-3 py-1 transition-colors ${viewMode === 'assets' ? 'bg-indigo-600 text-white' : 'text-zinc-500'}`}
              >
                Assets ({myAssets.length})
              </button>
            </div>
          </div>

          {viewMode === 'shop' && (
            <>
              <div className="mb-4 flex gap-2">
                <div className="flex flex-1 items-center rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
                  <Search className="mr-2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск..."
                    className="w-full bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
                  />
                </div>
                <button className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 active:bg-zinc-800">
                  <Filter className="h-4 w-4" />
                </button>
              </div>

              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {(['all', 'facebook', 'google', 'tiktok', 'proxy', 'bm'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      filterCategory === cat ? 'bg-white text-black border-white' : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {viewMode === 'shop' ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredItems.length === 0 && <p className="py-8 text-center text-zinc-500">Ничего не найдено</p>}
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 p-4 shadow-lg shadow-black/20 transition hover:border-zinc-700"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                      {item.category === 'facebook' && <span className="text-lg font-bold text-blue-500">f</span>}
                      {item.category === 'google' && <span className="text-lg font-bold text-red-500">G</span>}
                      {item.category === 'tiktok' && <span className="text-lg font-bold text-white">♪</span>}
                      {item.category === 'proxy' && <Globe className="h-5 w-5 text-purple-400" />}
                      {item.category === 'bm' && <Briefcase className="h-5 w-5 text-orange-400" />}
                      <div className="absolute -bottom-1 -right-1 rounded-full ring-2 ring-zinc-900">
                        <GeoFlag code={item.geo} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium leading-tight text-white">{item.title}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500">{item.supplier}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-white font-bold">${item.price.toFixed(2)}</span>
                    <span className="text-[10px] text-zinc-500">Stock: {item.stock}</span>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleInitiatePurchase(item)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-xs font-bold text-white transition hover:bg-indigo-500"
                >
                  <ShoppingCart className="h-3 w-3" /> Quick Buy
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {myAssets.length === 0 && (
              <div className="py-12 text-center">
                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-zinc-800" />
                <p className="text-sm text-zinc-500">Пусто. Купите что-нибудь.</p>
              </div>
            )}
            {myAssets.map((item) => (
              <div
                key={item.id}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-900 bg-zinc-950 p-3 transition hover:border-zinc-700"
                onClick={() => {
                  setSelectedItem(item);
                  setActiveModal('asset_detail');
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-800 text-sm font-bold text-zinc-400">
                    {item.category[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-[10px] text-zinc-500">ID: ...{item.id.slice(-6)}</p>
                  </div>
                </div>
                <button className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-indigo-400">Open</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const SourcesView = () => {
    const [view, setView] = useState<'table' | 'cards'>('table');

    return (
      <div className="space-y-4 pb-6">
        <div className="sticky top-0 z-10 -mx-2 flex items-center justify-between bg-zinc-950/80 px-2 pb-2 pt-2 backdrop-blur">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
            <BarChart2 className="h-6 w-6 text-indigo-500" /> Analytics
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => addToast('info', 'Sync API', 'Данные обновлены')}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-emerald-400 active:bg-zinc-800"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView(view === 'table' ? 'cards' : 'table')}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400"
            >
              {view === 'table' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {view === 'cards' ? (
          <div className="space-y-3">
            {sources.map((src) => (
              <div key={src.id} className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`rounded px-2 py-1 text-xs font-bold ${src.color}`}>{src.name}</div>
                  <span className={`text-xs font-bold ${src.financials.profit > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    ROI {src.financials.roi}%
                  </span>
                </div>
                <div className="mb-3 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] uppercase text-zinc-500">Spend</p>
                    <p className="text-sm font-mono text-white">${src.financials.spend.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-zinc-500">Revenue</p>
                    <p className="text-sm font-mono text-white">${src.financials.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-zinc-500">Profit</p>
                    <p className={`text-sm font-mono ${src.financials.profit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${src.financials.profit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-900">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-wider text-zinc-500">
                  <th className="sticky left-0 z-10 border-r border-zinc-800 bg-zinc-900 p-3">Source</th>
                  <th className="p-3 text-right" onClick={() => handleSortSources('spend')}>
                    <button className="flex w-full items-center justify-end gap-1 hover:text-white">Spend</button>
                  </th>
                  <th className="p-3 text-right" onClick={() => handleSortSources('revenue')}>
                    <button className="flex w-full items-center justify-end gap-1 hover:text-white">Rev</button>
                  </th>
                  <th className="p-3 text-right" onClick={() => handleSortSources('profit')}>
                    <button className="flex w-full items-center justify-end gap-1 hover:text-white">Profit</button>
                  </th>
                  <th className="p-3 text-right" onClick={() => handleSortSources('roi')}>
                    <button className="flex w-full items-center justify-end gap-1 hover:text-white">ROI</button>
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {sources.map((src) => (
                  <tr key={src.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/50">
                    <td className="sticky left-0 z-10 flex items-center gap-2 border-r border-zinc-800 bg-zinc-950 p-3 font-bold text-white">
                      <div className={`h-2 w-2 rounded-full ${src.financials.profit > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {src.name}
                    </td>
                    <td className="p-3 text-right font-mono text-zinc-300">${src.financials.spend.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-zinc-300">${src.financials.revenue.toLocaleString()}</td>
                    <td className={`p-3 text-right font-mono font-bold ${src.financials.profit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {src.financials.profit > 0 ? '+' : ''}
                      {src.financials.profit.toLocaleString()}
                    </td>
                    <td className={`p-3 text-right font-mono font-bold ${src.financials.roi > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {src.financials.roi}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const CampaignsView = () => (
    <div className="space-y-4 pb-6">
      <div className="sticky top-0 z-10 -mx-2 flex items-center justify-between bg-zinc-950/80 px-2 pb-2 pt-2 backdrop-blur">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
          <Rocket className="h-6 w-6 text-indigo-500" /> Campaigns
        </h1>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="text-white">{campaigns.filter((c) => c.status === 'active').length}</span> Active
        </div>
      </div>

      {campaigns.map((camp) => (
        <div
          key={camp.id}
          className="relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 p-4 shadow-lg shadow-black/20 transition hover:border-zinc-700"
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg p-2 ${
                  camp.vertical === 'Crypto'
                    ? 'bg-purple-500/10 text-purple-400'
                    : camp.vertical === 'Gambling'
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : 'bg-pink-500/10 text-pink-500'
                }`}
              >
                {camp.vertical === 'Crypto' ? <Zap className="h-4 w-4" /> : camp.vertical === 'Gambling' ? <Bitcoin className="h-4 w-4" /> : <Target className="h-4 w-4" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">#{camp.id} {camp.name}</h3>
                <p className="text-xs text-zinc-500">{camp.source}</p>
              </div>
            </div>
            <StatusBadge status={camp.status} />
          </div>

          <div className="mb-3 grid grid-cols-3 gap-2">
            <div>
              <p className="text-[10px] uppercase text-zinc-500">Spend</p>
              <p className="text-sm font-mono font-bold text-white">${camp.spend}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-zinc-500">Rev</p>
              <p className="text-sm font-mono font-bold text-white">${camp.revenue}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-zinc-500">ROI</p>
              <p className={`text-sm font-mono font-bold ${camp.roi > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {camp.roi > 0 ? '+' : ''}
                {camp.roi}%
              </p>
            </div>
          </div>

          <div className="flex gap-2 border-t border-zinc-800 pt-3">
            <button
              onClick={() => toggleCampaignStatus(camp.id)}
              className="flex-1 rounded bg-zinc-900 py-2 text-xs font-bold text-zinc-300 transition hover:bg-zinc-800"
            >
              {camp.status === 'active' ? 'PAUSE' : 'RESUME'}
            </button>
            <button
              onClick={() => scaleCampaign(camp.id)}
              className="flex-1 rounded bg-zinc-900 py-2 text-xs font-bold text-emerald-400 transition hover:bg-zinc-800"
            >
              SCALE
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const ProfileView = () => (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col items-center pt-4">
        <div className="mb-4 h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900">
            <span className="text-2xl font-bold text-white">AX</span>
          </div>
        </div>
        <h2 className="text-xl font-bold text-white">Alex Media Buyer</h2>
        <p className="text-sm text-zinc-500">Team: Alpha Squad</p>
      </div>
      <div className="space-y-2 px-4">
        <button
          onClick={() => addToast('info', 'Billing', 'Модуль в разработке')}
          className="flex w-full items-center justify-between rounded-xl border border-zinc-900 bg-zinc-950 px-4 py-4 text-left transition hover:border-zinc-700"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-zinc-500" />
            <span className="text-zinc-200">Billing & Invoices</span>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
        </button>
        <button
          onClick={() => addToast('info', 'Settings', 'Настройки сохранены')}
          className="flex w-full items-center justify-between rounded-xl border border-zinc-900 bg-zinc-950 px-4 py-4 text-left transition hover:border-zinc-700"
        >
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-zinc-500" />
            <span className="text-zinc-200">Settings</span>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
        </button>
      </div>
    </div>
  );

  const PurchaseModal = () => {
    const [qty, setQty] = useState(1);
    if (activeModal !== 'purchase' || !selectedItem) return null;

    return (
      <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 p-4 backdrop-blur">
        <div className="w-full rounded-3xl bg-zinc-900 p-6 pb-12">
          <h3 className="mb-4 text-xl font-bold text-white">Подтверждение покупки</h3>
          <div className="mb-6 rounded-xl bg-zinc-800 p-4">
            <p className="text-sm text-zinc-400">Товар:</p>
            <p className="mb-2 text-lg font-bold text-white">{selectedItem.title}</p>
            <div className="mt-2 flex items-center justify-between border-t border-zinc-700 pt-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-8 w-8 rounded-full bg-zinc-700 text-white">
                  -
                </button>
                <span className="text-xl font-mono text-white">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="h-8 w-8 rounded-full bg-zinc-700 text-white">
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-400">Итого:</p>
                <p className="text-xl font-bold text-emerald-400">${(selectedItem.price * qty).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setActiveModal(null)} className="flex-1 rounded-xl bg-zinc-800 py-3 font-bold text-white">
              Отмена
            </button>
            <button
              onClick={() => confirmPurchase(qty)}
              className="flex-1 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-500"
            >
              Купить
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AssetDetailModal = () => {
    if (activeModal !== 'asset_detail' || !selectedItem) return null;
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur">
        <div className="relative w-full max-w-sm rounded-2xl bg-zinc-900 p-6">
          <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-zinc-500">
            <X className="h-5 w-5" />
          </button>
          <h3 className="mb-1 text-lg font-bold text-white">Asset Credentials</h3>
          <p className="mb-6 text-xs text-zinc-500">ID: {selectedItem.id}</p>

          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <span className="mb-1 block text-[10px] uppercase text-zinc-500">Login / ID</span>
              <div className="flex items-center justify-between font-mono text-sm text-zinc-300">
                <span>1000293849182</span>
                <Copy className="h-4 w-4 cursor-pointer text-zinc-500 hover:text-white" onClick={() => addToast('success', 'Скопировано', 'ID в буфере обмена')} />
              </div>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <span className="mb-1 block text-[10px] uppercase text-zinc-500">Password</span>
              <div className="flex items-center justify-between font-mono text-sm text-zinc-300">
                <span>•••••••••••••</span>
                <Copy className="h-4 w-4 cursor-pointer text-zinc-500 hover:text-white" onClick={() => addToast('success', 'Скопировано', 'Пароль в буфере обмена')} />
              </div>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <span className="mb-1 block text-[10px] uppercase text-zinc-500">2FA Secret</span>
              <div className="flex items-center justify-between font-mono text-sm text-zinc-300">
                <span className="w-48 truncate">J2K3 L4M5 N6O7 P8Q9</span>
                <Copy className="h-4 w-4 cursor-pointer text-zinc-500 hover:text-white" onClick={() => addToast('success', 'Скопировано', '2FA код в буфере')} />
              </div>
            </div>
          </div>

          <button className="mt-6 w-full rounded-xl bg-zinc-800 py-3 font-bold text-zinc-300 transition hover:bg-zinc-700">
            Download Cookies (.json)
          </button>
        </div>
      </div>
    );
  };

  const SuperWizard = () => {
    if (!showWizard) return null;

    const currentNicheData = NICHE_TARGETING[wizardData.vertical] || NICHE_TARGETING['Gambling'];

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-white">
        <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-4">
          <button onClick={() => { setShowWizard(false); setWizardStep(1); }} className="rounded-full bg-zinc-900 p-2 text-zinc-400">
            <X className="h-5 w-5" />
          </button>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1 w-8 rounded-full transition-colors ${s <= wizardStep ? 'bg-indigo-500' : 'bg-zinc-800'}`} />
            ))}
          </div>
          <div className="w-9" />
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
          {wizardStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Шаг 1: Вертикаль</h2>
              <div className="grid grid-cols-2 gap-4">
                {(['Gambling', 'Crypto', 'Nutra', 'Dating'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setWizardData({ ...wizardData, vertical: v })}
                    className={`flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all ${
                      wizardData.vertical === v ? 'border-indigo-500 bg-zinc-800' : 'border-zinc-800 bg-zinc-900'
                    }`}
                  >
                    <span className="text-white font-medium">{v}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Шаг 2: Ассеты (Tech)</h2>
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase text-zinc-400">Рекламный Аккаунт</label>
                {myAssets.length > 0 ? (
                  <div className="space-y-2">
                    {myAssets.filter((a) => a.category === 'facebook' || a.category === 'google').map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => setWizardData({ ...wizardData, assetId: asset.id })}
                        className={`flex w-full items-center justify-between rounded-xl border p-4 ${
                          wizardData.assetId === asset.id ? 'border-indigo-500 bg-indigo-900/20' : 'border-zinc-800 bg-zinc-900'
                        }`}
                      >
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">{asset.title}</div>
                          <div className="text-[10px] text-zinc-500">{asset.tags.join(', ')}</div>
                        </div>
                        {wizardData.assetId === asset.id && <CheckCircle2 className="h-5 w-5 text-indigo-500" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900 p-6 text-center">
                    <p className="mb-4 text-sm text-zinc-500">Нет доступных аккаунтов</p>
                    <button
                      onClick={() => {
                        setShowWizard(false);
                        setActiveTab('market');
                      }}
                      className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-700"
                    >
                      Купить в Маркете
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Шаг 3: Таргетинг</h2>
                <span className="rounded border border-indigo-500/30 bg-indigo-900/30 px-2 py-1 text-xs font-bold text-indigo-400">
                  {wizardData.vertical} Mode
                </span>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400">
                  <Crosshair className="h-3 w-3" /> Целевое Действие (Conversion Goal)
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentNicheData.goals.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setWizardData({ ...wizardData, optimizationEvent: goal })}
                      className={`rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${
                        wizardData.optimizationEvent === goal
                          ? 'border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400">
                  <Users className="h-3 w-3" /> Сегменты Аудитории
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentNicheData.segments.map((segment) => {
                    const isSelected = wizardData.selectedSegments.includes(segment);
                    return (
                      <button
                        key={segment}
                        onClick={() => toggleSegment(segment)}
                        className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                          isSelected ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-zinc-800 bg-zinc-900 text-zinc-500'
                        }`}
                      >
                        {isSelected && <Check className="mr-1 inline h-3 w-3" />}
                        {segment}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400">
                  <Smartphone className="h-3 w-3" /> Технические Ограничения
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {currentNicheData.tech.map((tech) => {
                    const isSelected = wizardData.selectedTech.includes(tech);
                    return (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`rounded-xl border p-3 text-left text-xs font-bold transition-colors ${
                          isSelected ? 'border-zinc-500 bg-zinc-800 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-600'
                        }`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {wizardStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Шаг 4: Бюджетирование</h2>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400">
                    <Clock className="h-3 w-3" /> Тип Бюджета
                  </span>
                  <div className="flex rounded-lg bg-zinc-950 p-1">
                    <button
                      onClick={() => setWizardData({ ...wizardData, budgetType: 'Daily' })}
                      className={`rounded px-3 py-1 text-[10px] font-bold ${
                        wizardData.budgetType === 'Daily' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setWizardData({ ...wizardData, budgetType: 'Lifetime' })}
                      className={`rounded px-3 py-1 text-[10px] font-bold ${
                        wizardData.budgetType === 'Lifetime' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
                      }`}
                    >
                      Lifetime
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="mb-2 text-3xl font-bold text-white font-mono">${wizardData.budget.toLocaleString()}</div>
                  <input type="range" min="100" max="10000" step="100" value={wizardData.budget} onChange={(e) => setWizardData({ ...wizardData, budget: Number(e.target.value) })} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 5000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setWizardData({ ...wizardData, budget: val })}
                      className={`py-2 rounded-lg border text-xs font-bold transition-colors ${
                        wizardData.budget === val ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400">
                    <Sliders className="h-3 w-3" /> Стратегия Ставок
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['Lowest Cost', 'Bid Cap', 'ROAS Goal'].map((strat) => (
                    <button
                      key={strat}
                      onClick={() => setWizardData({ ...wizardData, bidStrategy: strat })}
                      className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-colors ${
                        wizardData.bidStrategy === strat ? 'bg-indigo-900/40 border-indigo-500 text-indigo-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                      }`}
                    >
                      {strat}
                    </button>
                  ))}
                </div>

                {wizardData.bidStrategy !== 'Lowest Cost' && (
                  <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                    <span className="text-xs text-zinc-400">Макс. ставка (Bid)</span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-zinc-500" />
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-16 border-b border-zinc-700 bg-transparent text-right text-sm font-mono text-white outline-none focus:border-indigo-500"
                        onChange={(e) => setWizardData({ ...wizardData, bidCapValue: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-900 bg-zinc-950 p-4">
          {wizardStep < 4 ? (
            <button onClick={() => setWizardStep((prev) => (prev + 1) as WizardStep)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-500">
              Далее <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleLaunchCampaign} className="w-full rounded-xl bg-emerald-500 py-3 font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 transition-transform">
              Запустить ($ {wizardData.budget})
            </button>
          )}
        </div>
      </div>
    );
  };

  const TabSwitcher = () => (
    <div className="mb-4 flex items-center justify-between gap-2 overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950 px-2 py-2 no-scrollbar">
      {[{ id: 'dashboard', label: 'Dash', icon: LayoutDashboard }, { id: 'sources', label: 'Analytics', icon: BarChart2 }, { id: 'market', label: 'Market', icon: ShoppingBag }, { id: 'campaigns', label: 'Campaigns', icon: Layers }, { id: 'profile', label: 'Profile', icon: MousePointer2 }].map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
              isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-400 hover:bg-zinc-900'
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 text-white shadow-[0_12px_60px_rgba(0,0,0,0.35)]">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #18181b; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
      `}</style>

      <ToastContainer toasts={toasts} />

      <div className="relative h-full w-full">
        <div className="flex items-center justify-between px-4 pb-2 pt-5">
          <div>
            <p className="text-xs uppercase text-zinc-500">SOURCEFLOW PRO · Telegram Skin</p>
            <h1 className="text-2xl font-bold text-white">Arbitrage OS</h1>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Launch
          </button>
        </div>

        <div className="px-3">
          <TabSwitcher />
          <div className="space-y-4">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'market' && <MarketView />}
            {activeTab === 'sources' && <SourcesView />}
            {activeTab === 'campaigns' && <CampaignsView />}
            {activeTab === 'profile' && <ProfileView />}
          </div>
        </div>
      </div>

      <SuperWizard />
      <PurchaseModal />
      <AssetDetailModal />
    </div>
  );
}
