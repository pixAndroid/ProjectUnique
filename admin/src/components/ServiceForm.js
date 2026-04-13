'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ServiceForm({ service }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', slug: '', image: '', description: '', shortDescription: '',
    metaTitle: '', metaDescription: '', order: 0, published: true,
    ...service
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !service ? { slug: slugify(value) } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error('Title is required');
    setLoading(true);
    try {
      if (service?._id) {
        await api.put(`/api/admin/services/${service._id}`, form);
        toast.success('Service updated');
      } else {
        await api.post('/api/admin/services', form);
        toast.success('Service created');
      }
      router.push('/dashboard/services');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="admin-label">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className="admin-input" required />
        </div>
        <div>
          <label className="admin-label">Slug</label>
          <input name="slug" value={form.slug} onChange={handleChange} className="admin-input" />
        </div>
      </div>

      <div>
        <label className="admin-label">Image URL</label>
        <input name="image" value={form.image} onChange={handleChange} className="admin-input" placeholder="https://..." />
        {form.image && (
          <img src={form.image} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg" onError={e => e.target.style.display = 'none'} />
        )}
      </div>

      <div>
        <label className="admin-label">Short Description</label>
        <input name="shortDescription" value={form.shortDescription} onChange={handleChange} className="admin-input" />
      </div>

      <div>
        <label className="admin-label">Full Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={6} className="admin-input resize-none" />
      </div>

      <div className="admin-card p-4">
        <h3 className="text-white font-medium mb-4">SEO Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="admin-label">Meta Title</label>
            <input name="metaTitle" value={form.metaTitle} onChange={handleChange} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Meta Description</label>
            <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={2} className="admin-input resize-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="admin-label">Display Order</label>
          <input name="order" type="number" value={form.order} onChange={handleChange} className="admin-input" />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
            <span className="text-slate-300 text-sm">Published</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-admin disabled:opacity-50">
          {loading ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}
