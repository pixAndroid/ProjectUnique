'use client';

import { getUser } from '@/lib/auth';
import { FaBell, FaUserCircle } from 'react-icons/fa';

export default function Header({ title }) {
  const user = getUser();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">
      <h1 className="text-white font-semibold text-lg">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors">
          <FaBell className="text-lg" />
        </button>
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
