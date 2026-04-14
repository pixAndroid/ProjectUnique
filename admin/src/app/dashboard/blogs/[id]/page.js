'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import BlogForm from '@/components/BlogForm';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditBlogPage({ params }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/admin/blogs/${params.id}`)
      .then(res => setBlog(res.data?.data || null))
      .catch(() => toast.error('Failed to load blog'))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Edit Blog" />
      <div className="p-6 max-w-4xl">
        <div className="admin-card p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : blog ? (
            <BlogForm blog={blog} />
          ) : (
            <p className="text-slate-400">Blog not found</p>
          )}
        </div>
      </div>
    </div>
  );
}
