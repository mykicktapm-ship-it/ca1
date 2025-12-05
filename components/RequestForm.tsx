'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTelegramInitData } from '@/hooks/useTelegramInitData';
import { apiPost } from '@/lib/api';
import type { Application } from '@/lib/types';

const geoPresets = ['US', 'CA', 'UK', 'DE', 'FR', 'BR', 'AU', 'IN', 'SG', 'AE'];
const platformOptions = [
  { label: 'Google Ads', value: 'google_ads' },
  { label: 'Facebook Ads', value: 'facebook_ads' },
  { label: 'TikTok Ads', value: 'tiktok_ads' },
  { label: 'Native / Programmatic', value: 'native' },
  { label: 'Email & Push', value: 'email_push' }
];

const formSchema = z.object({
  geo: z.array(z.string().min(1)).min(1, 'Select at least one GEO'),
  platform: z.string().min(1, 'Platform is required'),
  niche: z.string().min(2, 'Tell us about your niche'),
  audience: z.string().min(10, 'Describe your audience'),
  budget: z.number().min(100, 'Budget must be at least 100')
});

type FormValues = z.infer<typeof formSchema>;

export function RequestForm() {
  const router = useRouter();
  const { initData } = useTelegramInitData();
  const [geoInput, setGeoInput] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      geo: ['US'],
      platform: platformOptions[0]?.value ?? '',
      niche: '',
      audience: '',
      budget: 5000
    }
  });

  const watchedGeo = watch('geo');
  const watchedBudget = watch('budget');
  const watchedPlatform = watch('platform');
  const watchedNiche = watch('niche');
  const watchedAudience = watch('audience');

  const toggleGeo = (country: string) => {
    const current = getValues('geo');
    const exists = current.includes(country);
    const next = exists ? current.filter((item) => item !== country) : [...current, country];
    setValue('geo', next, { shouldValidate: true, shouldDirty: true });
  };

  const addCustomGeo = () => {
    const trimmed = geoInput.trim().toUpperCase();
    if (!trimmed) return;
    if (watchedGeo.includes(trimmed)) {
      setGeoInput('');
      return;
    }
    setValue('geo', [...watchedGeo, trimmed], { shouldValidate: true, shouldDirty: true });
    setGeoInput('');
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setServerSuccess(null);

    try {
      const payload = {
        geo: values.geo,
        service: values.platform,
        niche: values.niche,
        audience: values.audience,
        budget: values.budget,
        initData
      };

      const record = await apiPost<Application>('/api/applications', payload, { initData });
      setServerSuccess('Application created! Redirecting to payment...');
      router.push(`/pay?application_id=${record.id}`);
    } catch (error) {
      setServerError('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="space-y-8 rounded-2xl bg-white/5 p-6 shadow-lg shadow-black/30">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary">Request traffic</p>
        <h1 className="text-2xl font-semibold">Application form</h1>
        <p className="text-sm text-gray-400">
          Submit your traffic request. We will track it to your Telegram account.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[7fr,5fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>GEO (choose one or more)</span>
                <span className="text-xs text-gray-400">Tap to toggle</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {geoPresets.map((country) => {
                  const active = watchedGeo.includes(country);
                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() => toggleGeo(country)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        active
                          ? 'border-primary/60 bg-primary/20 text-white shadow-inner'
                          : 'border-white/10 bg-black/40 text-gray-200 hover:border-primary/40 hover:bg-primary/5'
                      }`}
                    >
                      {country}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  value={geoInput}
                  onChange={(event) => setGeoInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addCustomGeo();
                    }
                  }}
                  placeholder="Add custom GEO code"
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomGeo}
                  className="rounded-lg bg-primary px-3 text-sm font-semibold text-white shadow-primary/20 transition hover:opacity-90"
                >
                  Add
                </button>
              </div>
              {errors.geo && <p className="text-xs text-red-400">{errors.geo.message}</p>}
              {watchedGeo.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                  {watchedGeo.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => toggleGeo(item)}
                        className="text-gray-400 transition hover:text-red-300"
                        aria-label={`Remove ${item}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <label className="space-y-2 text-sm font-medium">
              <span>Platform</span>
              <select
                {...register('platform')}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              >
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-black text-white">
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.platform && <span className="text-xs text-red-400">{errors.platform.message}</span>}
            </label>

            <label className="space-y-2 text-sm font-medium">
              <span>Niche</span>
              <input
                {...register('niche')}
                placeholder="iGaming, Nutra, Finance..."
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              />
              {errors.niche && <span className="text-xs text-red-400">{errors.niche.message}</span>}
            </label>

            <label className="space-y-2 text-sm font-medium">
              <span>Audience</span>
              <textarea
                {...register('audience')}
                placeholder="Who are you trying to reach?"
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              />
              {errors.audience && <span className="text-xs text-red-400">{errors.audience.message}</span>}
            </label>

            <div className="md:col-span-2 space-y-3 rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between text-sm font-medium">
                <div>
                  <p>Budget</p>
                  <p className="text-xs text-gray-400">Drag the slider or type a number</p>
                </div>
                <span className="text-lg font-semibold text-primary">${watchedBudget.toLocaleString()}</span>
              </div>
              <Controller
                control={control}
                name="budget"
                render={({ field }) => (
                  <input
                    type="range"
                    min={100}
                    max={100000}
                    step={100}
                    value={field.value}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-primary/30 accent-primary"
                  />
                )}
              />
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={100}
                  max={100000}
                  step={100}
                  value={watchedBudget}
                  onChange={(event) =>
                    setValue('budget', Number(event.target.value || 0), {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }
                  className="w-36 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
                <div className="text-xs text-gray-400">USD</div>
              </div>
              {errors.budget && <span className="text-xs text-red-400">{errors.budget.message}</span>}
            </div>
          </div>

          {serverError && (
            <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {serverError}
            </div>
          )}

          {serverSuccess && (
            <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
              {serverSuccess}
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

        <div className="space-y-4">
          <div className="space-y-3 rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Live summary</p>
                <p className="text-xs text-gray-400">Your request at a glance</p>
              </div>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">Auto-updates</span>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-gray-400">GEO</dt>
                <dd className="text-right text-white">{watchedGeo.join(', ') || '—'}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-gray-400">Platform</dt>
                <dd className="text-right text-white">
                  {platformOptions.find((option) => option.value === watchedPlatform)?.label || '—'}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-gray-400">Niche</dt>
                <dd className="text-right text-white">{watchedNiche || '—'}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-gray-400">Audience</dt>
                <dd className="text-right text-white">{watchedAudience || '—'}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-gray-400">Budget</dt>
                <dd className="text-right text-white">${watchedBudget.toLocaleString()} USD</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-3 rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Expected Flow / How It Works</p>
                <p className="text-xs text-gray-400">What happens after you submit</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200">Step by step</span>
            </div>
            <ol className="space-y-2 text-sm text-gray-200">
              <li className="flex gap-2">
                <span className="mt-[2px] h-5 w-5 rounded-full bg-primary/20 text-center text-xs font-semibold text-primary">1</span>
                We validate your request details with Zod to keep data clean.
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-5 w-5 rounded-full bg-primary/20 text-center text-xs font-semibold text-primary">2</span>
                The application is sent to <code className="rounded bg-white/10 px-1">/api/applications</code> with your Telegram init data.
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-5 w-5 rounded-full bg-primary/20 text-center text-xs font-semibold text-primary">3</span>
                On success, you are redirected to payment with your new application ID.
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-5 w-5 rounded-full bg-primary/20 text-center text-xs font-semibold text-primary">4</span>
                If something fails, you&apos;ll see inline feedback to adjust and resubmit.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
