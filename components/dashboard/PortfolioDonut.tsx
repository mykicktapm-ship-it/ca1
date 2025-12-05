'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), { ssr: false });

interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

interface PortfolioDonutProps {
  title?: string;
  subtitle?: string;
  data: DonutDatum[];
}

export function PortfolioDonut({ title = 'Portfolio mix', subtitle, data }: PortfolioDonutProps) {
  useEffect(() => {
    const registerCharts = async () => {
      const { ArcElement, Chart, Legend, Tooltip } = await import('chart.js');
      Chart.register(ArcElement, Legend, Tooltip);
    };

    registerCharts();
  }, []);

  const hasData = data.some((item) => item.value > 0);
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color),
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="space-y-4 rounded-2xl bg-white/5 p-6 shadow-lg shadow-black/30">
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-wide text-primary">Portfolio</p>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
      {hasData ? (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
          <div className="mx-auto h-56 w-56">
            <Doughnut data={chartData} />
          </div>
          <div className="space-y-3 text-sm text-gray-200">
            {data.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <p className="font-medium">{item.label}</p>
                </div>
                <p className="font-semibold">{item.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400">No performance distribution available yet.</p>
      )}
    </div>
  );
}
