export type ApplicationStatus = 'new' | 'paid' | 'in_progress' | 'completed';

export interface Application {
  id: string;
  user_id: string;
  geo: string[];
  service: string;
  audience: string;
  budget: number;
  niche: string;
  status: ApplicationStatus;
  created_at: string;
}

export interface Metric {
  id: string;
  application_id: string;
  impressions: number;
  clicks: number;
  cost: number;
  timestamp: string;
}
