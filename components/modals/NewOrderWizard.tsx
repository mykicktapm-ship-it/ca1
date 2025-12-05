'use client';

import { useMemo, useState } from 'react';
import { sources } from '@/lib/mockData';

const niches = ['Fintech', 'E-commerce', 'Gaming', 'Education'];

interface NewOrderWizardProps {
  onClose: () => void;
}

export default function NewOrderWizard({ onClose }: NewOrderWizardProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    product: 'Product X',
    url: 'https://example.com',
    niche: niches[0],
    source: sources[0].id,
    budget: 1200,
    interests: 'crypto, investment, wallet',
    minAge: 21,
    maxAge: 50,
    devices: { mobile: true, desktop: false },
  });

  const selectedSource = useMemo(() => sources.find((s) => s.id === form.source)!, [form.source]);

  return (
    <div className="w-full max-w-2xl rounded-3xl bg-white p-4 shadow-2xl md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900">New Order</p>
          <p className="text-sm text-slate-500">Step {step} of 4</p>
        </div>
        <button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:text-slate-900">
          <span className="material-symbols-rounded">close</span>
        </button>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Product Name</label>
            <input
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Offer URL</label>
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Niche</label>
            <select
              value={form.niche}
              onChange={(e) => setForm({ ...form, niche: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              {niches.map((niche) => (
                <option key={niche}>{niche}</option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Geo targeting</p>
            <p>Specify GEO preferences later in the brief, defaults to multi-GEO smart delivery.</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {sources.map((source) => (
              <label
                key={source.id}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 ${
                  form.source === source.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="source"
                  checked={form.source === source.id}
                  onChange={() => setForm({ ...form, source: source.id })}
                  className="accent-indigo-600"
                />
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${source.color}`}>
                  {source.logo}
                </div>
                <div className="leading-tight">
                  <p className="font-semibold text-slate-900">{source.name}</p>
                  <p className="text-xs text-slate-500">Avail ${source.allocated - source.spent}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900">Budget</p>
              <span className="text-sm font-semibold text-indigo-600">${form.budget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={100}
              max={5000}
              step={50}
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
              className="mt-3 w-full accent-indigo-600"
            />
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">Balance OK</span>
              <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600">~5 Days</span>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Interests / Keywords</label>
            <textarea
              value={form.interests}
              onChange={(e) => setForm({ ...form, interests: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-slate-700">Min Age</label>
              <input
                type="number"
                value={form.minAge}
                onChange={(e) => setForm({ ...form, minAge: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Max Age</label>
              <input
                type="number"
                value={form.maxAge}
                onChange={(e) => setForm({ ...form, maxAge: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.devices.mobile}
                onChange={(e) => setForm({ ...form, devices: { ...form.devices, mobile: e.target.checked } })}
                className="accent-indigo-600"
              />
              Mobile
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.devices.desktop}
                onChange={(e) => setForm({ ...form, devices: { ...form.devices, desktop: e.target.checked } })}
                className="accent-indigo-600"
              />
              Desktop
            </label>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3 rounded-2xl bg-indigo-50 p-4 text-indigo-700">
            <span className="material-symbols-rounded">rocket_launch</span>
            <div>
              <p className="font-semibold">Ready to launch</p>
              <p className="text-indigo-600">We will review and push traffic after confirmation.</p>
            </div>
          </div>
          <div className="grid gap-3 rounded-2xl border border-slate-200 p-4 text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Offer</span>
              <span className="font-semibold text-slate-900">{form.product}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Source</span>
              <span className="font-semibold text-slate-900">{selectedSource.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Budget</span>
              <span className="font-semibold text-slate-900">${form.budget.toLocaleString()}</span>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-500">
            Mock submission only. Integrate API to create and redirect to orders list.
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={step === 1 ? onClose : () => setStep((s) => Math.max(1, s - 1))}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        {step < 4 ? (
          <button
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={onClose}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
          >
            Launch
          </button>
        )}
      </div>
    </div>
  );
}
