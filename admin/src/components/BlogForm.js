'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import ImagePicker from '@/components/ImagePicker';

const TiptapEditor = dynamic(() => import('./TiptapEditor'), { ssr: false, loading: () => (
  <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">Loading editor...</div>
)});

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function BlogForm({ blog }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', slug: '', image: '', content: '', excerpt: '',
    tags: '', metaTitle: '', metaDescription: '', published: false,
    ...blog,
    tags: blog?.tags?.join(', ') || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !blog ? { slug: slugify(value) } : {})
    }));
  };

  const handleContent = (content) => setForm(prev => ({ ...prev, content }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.slug) return toast.error('Title and slug are required');
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      if (blog?._id) {
        await api.put(`/api/admin/blogs/${blog._id}`, payload);
        toast.success('Blog updated successfully');
      } else {
        await api.post('/api/admin/blogs', payload);
        toast.success('Blog created successfully');
      }
      router.push('/dashboard/blogs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="admin-label">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className="admin-input" placeholder="Blog title" required />
        </div>
        <div>
          <label className="admin-label">Slug *</label>
          <input name="slug" value={form.slug} onChange={handleChange} className="admin-input" placeholder="blog-slug" required />
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
        <label className="admin-label">Excerpt</label>
        <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={3} className="admin-input resize-none" placeholder="Short description..." />
      </div>

      <div>
        <label className="admin-label">Content</label>
        <div className="border border-slate-600 rounded-lg overflow-hidden">
          <TiptapEditor content={form.content} onChange={handleContent} />
        </div>
      </div>

      <div>
        <label className="admin-label">Tags (comma-separated)</label>
        <input name="tags" value={form.tags} onChange={handleChange} className="admin-input" placeholder="maintenance, tips, AC care" />
      </div>

      <div className="admin-card p-4">
        <h3 className="text-white font-medium mb-4">SEO Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="admin-label">Meta Title</label>
            <input name="metaTitle" value={form.metaTitle} onChange={handleChange} className="admin-input" placeholder="SEO title" />
          </div>
          <div>
            <label className="admin-label">Meta Description</label>
            <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={2} className="admin-input resize-none" placeholder="SEO description" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="sr-only peer" />
          <div className="w-11 h-6 bg-slate-600 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
        <span className="text-slate-300 text-sm">Published</span>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-admin disabled:opacity-50">
          {loading ? 'Saving...' : (blog ? 'Update Blog' : 'Create Blog')}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}
