'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useNotifications } from './NotificationContext';

const levelStyles: Record<string, string> = {
  success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
  warning: 'bg-amber-50 border-amber-100 text-amber-800',
  error: 'bg-rose-50 border-rose-100 text-rose-800',
};

const levelIcons: Record<string, string> = {
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
};

export default function NotificationsRoot() {
  const { toasts, dismissToast } = useNotifications();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex flex-col items-center gap-2 px-3 pt-safe sm:items-end sm:px-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-3 py-3 shadow-xl shadow-slate-900/5 backdrop-blur ${levelStyles[toast.level]} animate-toast-in`}
        >
          <span className="material-symbols-rounded text-xl opacity-80">{levelIcons[toast.level]}</span>
          <div className="flex-1 text-sm leading-tight">
            {toast.title && <p className="font-semibold text-slate-900/90">{toast.title}</p>}
            <p className="text-slate-700/80">{toast.message}</p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="rounded-full p-1 text-slate-500 transition hover:bg-white/60 hover:text-slate-900"
            aria-label="Close notification"
          >
            <span className="material-symbols-rounded text-lg">close</span>
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}
