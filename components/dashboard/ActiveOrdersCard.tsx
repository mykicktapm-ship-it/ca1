interface ActiveOrdersCardProps {
  count: number;
  delta: string;
}

export default function ActiveOrdersCard({ count, delta }: ActiveOrdersCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Active Orders</p>
          <p className="text-2xl font-semibold text-slate-900">{count}</p>
        </div>
        <span className="material-symbols-rounded text-indigo-500">playlist_add_check_circle</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-emerald-600">{delta}</p>
    </div>
  );
}
