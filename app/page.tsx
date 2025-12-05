'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';

interface FormValues {
  geo: string;
  service: string;
  audience: string;
  budget: number;
  niche: string;
}

export default function HomePage() {
  const { initData } = useTelegramInitData();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      geo: '',
      service: '',
      audience: '',
      budget: 0,
      niche: ''
    }
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setErrorMessage(null);
    const payload = {
      ...data,
      geo: data.geo.split(',').map((item) => item.trim()).filter(Boolean),
      budget: Number(data.budget),
      initData
    };

    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const message = await response.text();
      setErrorMessage(message || 'Failed to create application');
      return;
    }

    const record = await response.json();
    router.push(`/pay?application_id=${record.id}`);
  };

  return (
    <section className="space-y-6 rounded-2xl bg-white/5 p-6 shadow-lg shadow-black/30">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary">Request traffic</p>
        <h1 className="text-2xl font-semibold">Application form</h1>
        <p className="text-sm text-gray-400">
          Submit your traffic request. We will track it to your Telegram account.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">
            <span>Geo (comma separated)</span>
            <input
              {...register('geo', { required: true })}
              placeholder="US, CA, UK"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
            {errors.geo && <span className="text-xs text-red-400">Required</span>}
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Service</span>
            <input
              {...register('service', { required: true })}
              placeholder="google_ads"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
            {errors.service && <span className="text-xs text-red-400">Required</span>}
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Audience</span>
            <input
              {...register('audience', { required: true })}
              placeholder="Target audience"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
            {errors.audience && <span className="text-xs text-red-400">Required</span>}
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Budget</span>
            <input
              type="number"
              step="0.01"
              {...register('budget', { required: true, min: 0 })}
              placeholder="5000"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
            {errors.budget && <span className="text-xs text-red-400">Required</span>}
          </label>
          <label className="md:col-span-2 space-y-2 text-sm font-medium">
            <span>Niche</span>
            <input
              {...register('niche', { required: true })}
              placeholder="iGaming, Nutra"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
            {errors.niche && <span className="text-xs text-red-400">Required</span>}
          </label>
        </div>
        {errorMessage && (
          <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Create request'}
        </button>
      </form>
    </section>
  );
}
