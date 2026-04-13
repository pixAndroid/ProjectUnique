'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import DataTable from '@/components/DataTable';
import api from '@/lib/api';
import { FaPlus } from 'react-icons/fa';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/admin/products');
      setProducts(res.data?.data || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/products/${id}`);
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category', render: (v) => <span className="text-slate-400">{v || '—'}</span> },
    { key: 'price', label: 'Price', render: (v) => <span className="text-green-400 font-medium">{v || '—'}</span> },
    { key: 'views', label: 'Views', render: (v) => <span className="text-slate-400">{v || 0}</span> },
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
      <Header title="Products Management" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-400 text-sm">{products.length} total products</p>
          <Link href="/dashboard/products/new" className="btn-admin flex items-center gap-2">
            <FaPlus className="text-xs" /> New Product
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
              data={products}
              onEdit={(row) => router.push(`/dashboard/products/${row._id}`)}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
