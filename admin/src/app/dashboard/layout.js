'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { NotificationsProvider } from '@/lib/useNotifications';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <NotificationsProvider>
        <div className="flex min-h-screen bg-slate-950">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </NotificationsProvider>
    </ProtectedRoute>
  );
}
