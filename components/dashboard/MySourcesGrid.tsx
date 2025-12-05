'use client';

import { SourceCard } from './SourceCard';

export interface SourceOverview {
  id: string;
  name: string;
  platform: string;
  region: string;
  spend: number;
  ctr: number;
  conversions: number;
  status: string;
}

interface MySourcesGridProps {
  sources: SourceOverview[];
}

export function MySourcesGrid({ sources }: MySourcesGridProps) {
  return (
    <div className="space-y-4 rounded-2xl bg-white/5 p-6 shadow-lg shadow-black/30">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary">My Sources</p>
          <h2 className="text-xl font-semibold text-white">Performance overview</h2>
          <p className="text-sm text-gray-400">Campaign sources with quick performance highlights.</p>
        </div>
        <button className="w-full rounded-xl border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10 sm:w-auto">
          Add source
        </button>
      </div>
      {sources.length === 0 ? (
        <p className="text-sm text-gray-400">No sources available yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <SourceCard key={source.id} {...source} />
          ))}
        </div>
      )}
    </div>
  );
}
