'use client';

import { useState } from 'react';
import { getUser } from '@/lib/auth';
import { useNotifications } from '@/lib/useNotifications';
import NotificationPanel from '@/components/NotificationPanel';
import { FaBell, FaUserCircle } from 'react-icons/fa';

export default function Header({ title }) {
  const user = getUser();
  const [panelOpen, setPanelOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">
      <h1 className="text-white font-semibold text-lg">{title}</h1>
      <div className="flex items-center gap-4">
        {/* Bell with unread badge */}
        <div className="relative">
          <button
            onClick={() => setPanelOpen(o => !o)}
            className="text-slate-400 hover:text-white transition-colors relative"
          >
            <FaBell className="text-lg" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-0.5 leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          {panelOpen && (
            <NotificationPanel
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkRead={markRead}
              onMarkAllRead={markAllRead}
              onClear={clearAll}
              onClose={() => setPanelOpen(false)}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <FaUserCircle className="text-slate-400 text-2xl" />
          <div>
            <div className="text-sm font-medium text-white">{user?.email || 'Admin'}</div>
            <div className="text-xs text-slate-400 capitalize">{user?.role || 'Administrator'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
