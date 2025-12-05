'use client';

interface BudgetSliderProps {
  value: number;
  onChange: (nextValue: number) => void;
  min?: number;
  max?: number;
}

export function BudgetSlider({ value, onChange, min = 100, max = 100000 }: BudgetSliderProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[#0f1118] p-4">
      <div className="flex items-center justify-between text-sm font-medium">
        <div>
          <p>Бюджет</p>
          <p className="text-xs text-[var(--text-muted)]">Сдвиньте ползунок или введите сумму вручную</p>
        </div>
        <span className="text-lg font-semibold text-[var(--primary)]">${value.toLocaleString()}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--primary-soft)] accent-[var(--primary)]"
      />
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={min}
          max={max}
          step={100}
          value={value}
          onChange={(event) => onChange(Number(event.target.value || 0))}
          className="w-36 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-white placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
        />
        <div className="text-xs text-[var(--text-muted)]">USD</div>
      </div>
      <div className="flex justify-between text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
        <span>Min ${min}</span>
        <span>Max ${max.toLocaleString()}</span>
      </div>
    </div>
  );
}
