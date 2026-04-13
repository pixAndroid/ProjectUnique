'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import DataTable from '@/components/DataTable';
import api from '@/lib/api';
import { FaPlus } from 'react-icons/fa';

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/api/admin/blogs');
      setBlogs(res.data?.data || []);
    } catch {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/blogs/${id}`);
      toast.success('Blog deleted');
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch {
      toast.error('Failed to delete blog');
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    {
      key: 'published',
      label: 'Status',
      render: (v) => (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${v ? 'bg-green-500/20 text-green-400' : 'bg-slate-600 text-slate-400'}`}>
          {v ? 'Published' : 'Draft'}
        </span>
      )
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (v) => (
        <span className="text-slate-400 text-xs">{Array.isArray(v) ? v.join(', ') : '—'}</span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (v) => new Date(v).toLocaleDateString('en-IN')
    }
  ];

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Blog Management" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-400 text-sm">{blogs.length} total blogs</p>
          <Link href="/dashboard/blogs/new" className="btn-admin flex items-center gap-2">
            <FaPlus className="text-xs" /> New Blog
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
              data={blogs}
              onEdit={(row) => router.push(`/dashboard/blogs/${row._id}`)}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
