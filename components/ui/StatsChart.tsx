'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false });

type Dataset = { label: string; data: number[]; backgroundColor: string };

interface StatsChartProps {
  labels: string[];
  datasets: Dataset[];
}

export function StatsChart({ labels, datasets }: StatsChartProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const register = async () => {
      const { ArcElement, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } = await import('chart.js');
      Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
      setReady(true);
    };

    register();
  }, []);

  if (!ready) return <p className="text-sm text-[var(--text-muted)]">Загружаем график...</p>;
  if (labels.length === 0) return <p className="text-sm text-[var(--text-muted)]">Нет данных для отображения.</p>;

  return <Bar data={{ labels, datasets }} className="bg-[#0f1118]" />;
}
