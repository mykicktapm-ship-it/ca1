'use client';

interface GeoSelectProps {
  options: string[];
  value: string[];
  onToggle: (country: string) => void;
  onAdd: (country: string) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  error?: string;
}

export function GeoSelect({ options, value, onToggle, onAdd, inputValue, onInputChange, error }: GeoSelectProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map((country) => {
          const active = value.includes(country);
          return (
            <button
              key={country}
              type="button"
              onClick={() => onToggle(country)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? 'border-[var(--primary)]/70 bg-[var(--primary-soft)] text-white shadow-[0_10px_25px_rgba(90,99,255,0.25)]'
                  : 'border-[var(--border)] bg-[#0f1118] text-[var(--text-muted)] hover:border-[var(--primary)]/40 hover:text-white'
              }`}
            >
              {country}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onAdd(inputValue);
            }
          }}
          placeholder="Добавить свой GEO (например, ES)"
          className="w-full rounded-xl border border-[var(--border)] bg-[#0f1118] px-3 py-2 text-sm text-white placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => onAdd(inputValue)}
          className="rounded-xl bg-[var(--primary)] px-3 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(90,99,255,0.4)] transition hover:opacity-90"
        >
          +
        </button>
      </div>
      {error && <p className="text-xs text-[var(--accent-danger,#ff4267)]">{error}</p>}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
          {value.map((item) => (
            <span key={item} className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
              {item}
              <button
                type="button"
                onClick={() => onToggle(item)}
                className="text-[var(--text-muted)] transition hover:text-[#ff7a98]"
                aria-label={`Remove ${item}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
