'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { getToken } from '@/lib/auth';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newEnquiries, setNewEnquiries] = useState(0);
  const [newEnquiryTick, setNewEnquiryTick] = useState(0);
  const esRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/notifications');
      setNotifications(res.data?.data || []);
      setUnreadCount(res.data?.unreadCount || 0);
    } catch {
      // silent
    }
  }, []);

  const fetchNewEnquiries = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/enquiries');
      const all = res.data?.data || [];
      setNewEnquiries(all.filter(e => e.status === 'new').length);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchNewEnquiries();
  }, [fetchNotifications, fetchNewEnquiries]);

  // Single SSE connection for the whole dashboard
  useEffect(() => {
    const token = getToken();
    if (!token || typeof window === 'undefined') return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const url = `${apiBase}/api/admin/notifications/stream?token=${encodeURIComponent(token)}`;

    let es;
    let retryTimer;

    function connect() {
      es = new EventSource(url);
      esRef.current = es;

      es.addEventListener('new_enquiry', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (typeof payload.newEnquiriesCount === 'number') {
            setNewEnquiries(payload.newEnquiriesCount);
          }
          if (payload.notification) {
            setNotifications(prev => [payload.notification, ...prev]);
            setUnreadCount(c => c + 1);
          }
          setNewEnquiryTick(t => t + 1);
        } catch {
          // ignore
        }
      });

      es.addEventListener('notification', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.notification) {
            setNotifications(prev => [payload.notification, ...prev]);
            setUnreadCount(c => c + 1);
          }
        } catch {
          // ignore
        }
      });

      es.onerror = () => {
        es.close();
        retryTimer = setTimeout(connect, 5000);
      };
    }

    connect();

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      if (esRef.current) esRef.current.close();
    };
  }, []);

  const markRead = useCallback(async (id) => {
    try {
      await api.put(`/api/admin/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(c => Math.max(0, c - 1));
    } catch {
      // silent
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await api.put('/api/admin/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // silent
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await api.delete('/api/admin/notifications/clear');
      setNotifications([]);
      setUnreadCount(0);
    } catch {
      // silent
    }
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, newEnquiries, newEnquiryTick, markRead, markAllRead, clearAll, refreshNewEnquiries: fetchNewEnquiries }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
