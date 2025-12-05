interface RoiCardProps {
  roi: number;
}

export default function RoiCard({ roi }: RoiCardProps) {
  return (
    <div className="hidden rounded-3xl bg-white p-4 shadow-sm md:block">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Avg. ROI (Week)</p>
          <p className="text-2xl font-semibold text-slate-900">{roi}%</p>
        </div>
        <span className="material-symbols-rounded text-indigo-500">trending_up</span>
      </div>
      <p className="mt-2 text-sm text-emerald-600">Stable performance</p>
    </div>
  );
}
