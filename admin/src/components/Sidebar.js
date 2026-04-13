'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaSnowflake, FaTachometerAlt, FaBlog, FaTools, FaBox, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '@/lib/auth';

const navItems = [
  { href: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
  { href: '/dashboard/blogs', icon: FaBlog, label: 'Blogs' },
  { href: '/dashboard/services', icon: FaTools, label: 'Services' },
  { href: '/dashboard/products', icon: FaBox, label: 'Products' },
  { href: '/dashboard/enquiries', icon: FaEnvelope, label: 'Enquiries' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-700 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-700">
        <FaSnowflake className="text-indigo-400 text-xl" />
        <div>
          <div className="font-bold text-white text-sm">Unique AC</div>
          <div className="text-xs text-slate-400">Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="text-base flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors w-full"
        >
          <FaSignOutAlt className="text-base" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
