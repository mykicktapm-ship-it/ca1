'use client';

interface BalanceCardProps {
  balance: number;
  onTopUp?: () => void;
}

export default function BalanceCard({ balance, onTopUp }: BalanceCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/10 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-4 text-white shadow-xl sm:p-5">
      <div className="absolute -right-4 -top-8 text-[140px] text-white/10">
        <span className="material-symbols-rounded">account_balance_wallet</span>
      </div>
      <p className="text-sm text-indigo-100">Total Balance</p>
      <p className="mt-1 text-3xl font-semibold leading-tight">${balance.toLocaleString()}</p>
      <button
        onClick={onTopUp}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/25 sm:w-auto"
      >
        <span className="material-symbols-rounded text-base">add</span>
        TOP UP
      </button>
    </div>
  );
}
