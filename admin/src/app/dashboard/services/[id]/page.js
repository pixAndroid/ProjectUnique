'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ServiceForm from '@/components/ServiceForm';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditServicePage({ params }) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/services')
      .then(res => {
        const found = (res.data?.data || []).find(s => s._id === params.id);
        setService(found || null);
      })
      .catch(() => toast.error('Failed to load service'))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Edit Service" />
      <div className="p-6 max-w-4xl">
        <div className="admin-card p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : service ? (
            <ServiceForm service={service} />
          ) : (
            <p className="text-slate-400">Service not found</p>
          )}
        </div>
      </div>
    </div>
  );
}
