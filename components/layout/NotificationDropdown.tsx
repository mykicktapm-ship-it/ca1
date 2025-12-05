'use client';

import { useState } from 'react';
import { useNotifications } from './NotificationContext';

const typeIcons: Record<string, string> = {
  order_created: 'add_circle',
  order_started: 'play_arrow',
  order_warning: 'warning',
  invoice_issued: 'receipt_long',
};

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((prev) => !prev);
    markAllAsRead();
  };

  return (
    <div className="relative">
      <button
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:text-slate-900"
        onClick={toggle}
        aria-label="Open notifications"
      >
        <span className="material-symbols-rounded text-2xl">notifications</span>
        {unreadCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Notifications</span>
            <button onClick={markAllAsRead} className="text-indigo-600 hover:text-indigo-500">
              Mark all read
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-auto">
            {notifications.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-2 rounded-xl p-2 ${item.read ? 'bg-slate-50' : 'bg-indigo-50/70'}`}
                onClick={() => markAsRead(item.id)}
              >
                <span className="material-symbols-rounded text-indigo-600">{typeIcons[item.type]}</span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-600">{item.message}</p>
                  <p className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
