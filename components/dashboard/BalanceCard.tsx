'use client';

interface BalanceCardProps {
  balance: number;
  onTopUp?: () => void;
}

export default function BalanceCard({ balance, onTopUp }: BalanceCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-5 text-white shadow-xl">
      <div className="absolute -right-4 -top-8 text-[140px] text-white/10">
        <span className="material-symbols-rounded">account_balance_wallet</span>
      </div>
      <p className="text-sm text-indigo-100">Total Balance</p>
      <p className="mt-1 text-3xl font-semibold">${balance.toLocaleString()}</p>
      <button
        onClick={onTopUp}
        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/25"
      >
        <span className="material-symbols-rounded text-base">add</span>
        TOP UP
      </button>
    </div>
  );
}
