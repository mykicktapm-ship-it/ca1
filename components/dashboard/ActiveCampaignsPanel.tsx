'use client';

interface ActiveCampaign {
  id: string;
  name: string;
  status: string;
  reach: number;
  spend: number;
  geo: string;
  applications: number;
}

interface ActiveCampaignsPanelProps {
  campaigns: ActiveCampaign[];
}

export function ActiveCampaignsPanel({ campaigns }: ActiveCampaignsPanelProps) {
  return (
    <div className="space-y-4 rounded-2xl bg-white/5 p-6 shadow-lg shadow-black/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary">Active</p>
          <h2 className="text-xl font-semibold text-white">Live campaigns</h2>
          <p className="text-sm text-gray-400">Live sources and applications in market.</p>
        </div>
        <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
          {campaigns.length} running
        </span>
      </div>
      {campaigns.length === 0 ? (
        <p className="text-sm text-gray-400">No active campaigns.</p>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{campaign.name}</p>
                <p className="text-xs text-gray-400">Geo: {campaign.geo}</p>
                <p className="text-xs text-gray-400">Applications: {campaign.applications}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-right text-sm text-gray-200">
                <div>
                  <p className="text-xs text-gray-400">Reach</p>
                  <p className="font-semibold">{campaign.reach.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Spend</p>
                  <p className="font-semibold">${campaign.spend.toLocaleString()}</p>
                </div>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                {campaign.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
