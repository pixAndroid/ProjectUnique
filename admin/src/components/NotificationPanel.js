'use client';

import { useEffect, useRef } from 'react';
import { FaBell, FaEnvelope, FaBlog, FaChartLine, FaCheck, FaTrash, FaTimes } from 'react-icons/fa';

const typeIcons = {
  new_enquiry: FaEnvelope,
  blog_published: FaBlog,
  blog_edited: FaBlog,
  milestone_view: FaChartLine,
  milestone_click: FaChartLine,
};

const typeBg = {
  new_enquiry: 'bg-yellow-500/20 text-yellow-400',
  blog_published: 'bg-green-500/20 text-green-400',
  blog_edited: 'bg-blue-500/20 text-blue-400',
  milestone_view: 'bg-indigo-500/20 text-indigo-400',
  milestone_click: 'bg-purple-500/20 text-purple-400',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationPanel({ notifications, unreadCount, onMarkRead, onMarkAllRead, onClear, onClose }) {
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-12 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 flex flex-col max-h-[480px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <FaBell className="text-indigo-400" />
          <span className="text-white font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              title="Mark all as read"
              className="text-slate-400 hover:text-green-400 transition-colors text-xs flex items-center gap-1"
            >
              <FaCheck className="text-xs" />
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClear}
              title="Clear all"
              className="text-slate-400 hover:text-red-400 transition-colors"
            >
              <FaTrash className="text-xs" />
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <FaTimes className="text-sm" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">No notifications yet</div>
        ) : (
          notifications.map(n => {
            const Icon = typeIcons[n.type] || FaBell;
            const colorClass = typeBg[n.type] || 'bg-slate-700 text-slate-300';
            return (
              <div
                key={n.id}
                onClick={() => !n.read && onMarkRead(n.id)}
                className={`flex items-start gap-3 px-4 py-3 border-b border-slate-700/50 cursor-pointer transition-colors hover:bg-slate-700/40 ${
                  !n.read ? 'bg-slate-700/20' : ''
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${colorClass}`}>
                  <Icon className="text-xs" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-snug ${n.read ? 'text-slate-400' : 'text-white font-medium'}`}>
                    {n.message}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 bg-indigo-400 rounded-full flex-shrink-0 mt-1" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
