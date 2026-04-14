'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import ImagePicker from '@/components/ImagePicker';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ProductForm({ product }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', slug: '', image: '', description: '', shortDescription: '',
    price: '', category: '', published: true,
    ...product
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !product ? { slug: slugify(value) } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error('Title is required');
    setLoading(true);
    try {
      if (product?._id) {
        await api.put(`/api/admin/products/${product._id}`, form);
        toast.success('Product updated');
      } else {
        await api.post('/api/admin/products', form);
        toast.success('Product created');
      }
      router.push('/dashboard/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="admin-label">Price</label>
          <input name="price" value={form.price} onChange={handleChange} className="admin-input" placeholder="₹999" />
        </div>
        <div>
          <label className="admin-label">Category</label>
          <input name="category" value={form.category} onChange={handleChange} className="admin-input" placeholder="Filters, Refrigerants, etc." />
        </div>
      </div>

      <div>
        <label className="admin-label">Image</label>
        <ImagePicker
          value={form.image}
          onChange={url => setForm(prev => ({ ...prev, image: url }))}
        />
      </div>

      <div>
        <label className="admin-label">Short Description</label>
        <input name="shortDescription" value={form.shortDescription} onChange={handleChange} className="admin-input" />
      </div>

      <div>
        <label className="admin-label">Full Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={6} className="admin-input resize-none" />
      </div>

      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="sr-only peer" />
          <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
        <span className="text-slate-300 text-sm">Published</span>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-admin disabled:opacity-50">
          {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}
