'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTelegramInitData } from '@/hooks/useTelegramInitData';
import { apiPost } from '@/lib/api';
import type { Application } from '@/lib/types';
import { BudgetSlider } from './ui/BudgetSlider';
import { FormCard } from './ui/FormCard';
import { GeoSelect } from './ui/GeoSelect';

const geoPresets = ['US', 'CA', 'UK', 'DE', 'FR', 'BR', 'AU', 'IN', 'SG', 'AE'];
const platformOptions = [
  { label: 'Meta', value: 'facebook_ads' },
  { label: 'TikTok Ads', value: 'tiktok_ads' },
  { label: 'Google Ads', value: 'google_ads' },
  { label: 'Native / Programmatic', value: 'native' },
  { label: 'Other', value: 'email_push' }
];

const formSchema = z.object({
  geo: z.array(z.string().min(1)).min(1, 'Укажите хотя бы одно GEO'),
  platform: z.string().min(1, 'Укажите платформу'),
  niche: z.string().min(2, 'Расскажите о нише'),
  audience: z.string().min(10, 'Опишите целевую аудиторию'),
  budget: z.number().min(100, 'Минимальный бюджет — 100')
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
      setServerSuccess('Заявка отправлена. Перенаправляем на оплату...');
      router.push(`/pay?application_id=${record.id}`);
    } catch (_error) {
      setServerError('Что-то пошло не так. Попробуйте еще раз.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">SOURCEFLOW Intake</p>
        <h1 className="text-2xl font-semibold">Заявка на арбитраж трафика</h1>
        <p className="text-sm text-[var(--text-muted)]">Все шаги в Telegram. Без переключений и сложных форм.</p>
      </div>

      <FormCard
        title="1 / 3 — GEO"
        description="Выберите страны, куда будем вести трафик."
        action={<span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs text-[var(--primary)]">Мультивыбор</span>}
      >
        <GeoSelect
          options={geoPresets}
          value={watchedGeo}
          onToggle={toggleGeo}
          onAdd={addCustomGeo}
          inputValue={geoInput}
          onInputChange={setGeoInput}
          error={errors.geo?.message}
        />
      </FormCard>

      <FormCard title="2 / 3 — Параметры" description="Платформа, ниша и аудитория, на которую таргетируемся.">
        <div className="space-y-4">
          <label className="space-y-2 text-sm font-medium">
            <span className="text-[var(--text-muted)]">Платформа</span>
            <select
              {...register('platform')}
              className="w-full rounded-xl border border-[var(--border)] bg-[#0f1118] px-3 py-2 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
            >
              {platformOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#0f1118] text-white">
                  {option.label}
                </option>
              ))}
            </select>
            {errors.platform && <span className="text-xs text-[#ff7a98]">{errors.platform.message}</span>}
          </label>

          <label className="space-y-2 text-sm font-medium">
            <span className="text-[var(--text-muted)]">Ниша</span>
            <input
              {...register('niche')}
              placeholder="iGaming, e-com, финансы..."
              className="w-full rounded-xl border border-[var(--border)] bg-[#0f1118] px-3 py-2 text-sm text-white placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
            />
            {errors.niche && <span className="text-xs text-[#ff7a98]">{errors.niche.message}</span>}
          </label>

          <label className="space-y-2 text-sm font-medium">
            <span className="text-[var(--text-muted)]">Целевая аудитория</span>
            <textarea
              {...register('audience')}
              placeholder="Возраст, интересы, ключевые триггеры"
              rows={4}
              className="w-full rounded-xl border border-[var(--border)] bg-[#0f1118] px-3 py-2 text-sm text-white placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
            />
            {errors.audience && <span className="text-xs text-[#ff7a98]">{errors.audience.message}</span>}
          </label>
        </div>
      </FormCard>

      <FormCard title="3 / 3 — Бюджет" description="Гибкий диапазон с обновлением суммы в реальном времени.">
        <Controller
          control={control}
          name="budget"
          render={({ field }) => (
            <BudgetSlider value={field.value} onChange={(val) => field.onChange(Number(val))} />
          )}
        />
        {errors.budget && <span className="text-xs text-[#ff7a98]">{errors.budget.message}</span>}
      </FormCard>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[#1c1f2a] to-[#12141d] p-4 shadow-[0_20px_45px_rgba(0,0,0,0.45)]" style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>Итого</span>
          <span className="text-lg font-semibold text-white">${watchedBudget.toLocaleString()}</span>
        </div>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_14px_30px_rgba(90,99,255,0.35)] transition hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? 'Отправляем...' : 'Отправить заявку'}
        </button>
        <p className="text-[12px] text-[var(--text-muted)]">После отправки мы сразу предложим оплату. Все данные привязаны к вашему Telegram.</p>
        {serverError && (
          <div className="rounded-lg border border-[#ff7a98]/40 bg-[#ff4267]/10 px-3 py-2 text-xs text-[#ffbed0]">
            {serverError}
          </div>
        )}
        {serverSuccess && (
          <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
            {serverSuccess}
          </div>
        )}
      </div>

      <FormCard
        subtle
        title="Как это работает"
        description="Алгоритм SOURCEFLOW. Все прозрачно и обновляется каждые 6 часов."
      >
        <ol className="space-y-3 text-sm text-[var(--text-muted)]">
          <li className="flex gap-3">
            <span className="mt-[2px] h-6 w-6 rounded-xl bg-[var(--primary-soft)] text-center text-xs font-semibold text-[var(--primary)]">1</span>
            Фиксируем параметры заявки и валидируем данные прямо в мини-приложении.
          </li>
          <li className="flex gap-3">
            <span className="mt-[2px] h-6 w-6 rounded-xl bg-[var(--primary-soft)] text-center text-xs font-semibold text-[var(--primary)]">2</span>
            Передаем их на /api/applications вместе с initData Telegram.
          </li>
          <li className="flex gap-3">
            <span className="mt-[2px] h-6 w-6 rounded-xl bg-[var(--primary-soft)] text-center text-xs font-semibold text-[var(--primary)]">3</span>
            После создания заявки открывается экран оплаты с вашим ID.
          </li>
          <li className="flex gap-3">
            <span className="mt-[2px] h-6 w-6 rounded-xl bg-[var(--primary-soft)] text-center text-xs font-semibold text-[var(--primary)]">4</span>
            После оплаты статус меняется, а метрики подгружаются каждые 6 часов.
          </li>
        </ol>
      </FormCard>
    </div>
  );
}
