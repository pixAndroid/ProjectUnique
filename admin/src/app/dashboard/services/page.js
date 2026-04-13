'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import DataTable from '@/components/DataTable';
import api from '@/lib/api';
import { FaPlus } from 'react-icons/fa';

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await api.get('/api/admin/services');
      setServices(res.data?.data || []);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/services/${id}`);
      toast.success('Service deleted');
      setServices(prev => prev.filter(s => s._id !== id));
    } catch {
      toast.error('Failed to delete service');
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'views', label: 'Views', render: (v) => <span className="text-slate-400">{v || 0}</span> },
    { key: 'clickCount', label: 'Clicks', render: (v) => <span className="text-slate-400">{v || 0}</span> },
    { key: 'order', label: 'Order', render: (v) => <span className="text-slate-400">{v}</span> },
    {
      key: 'published',
      label: 'Status',
      render: (v) => (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${v ? 'bg-green-500/20 text-green-400' : 'bg-slate-600 text-slate-400'}`}>
          {v ? 'Active' : 'Hidden'}
        </span>
      )
    }
  ];

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Services Management" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-400 text-sm">{services.length} total services</p>
          <Link href="/dashboard/services/new" className="btn-admin flex items-center gap-2">
            <FaPlus className="text-xs" /> New Service
          </Link>
        </div>
        <div className="admin-card">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={services}
              onEdit={(row) => router.push(`/dashboard/services/${row._id}`)}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
