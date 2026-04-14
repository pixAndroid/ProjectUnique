'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FaUpload, FaImage, FaTimes, FaCheck } from 'react-icons/fa';

export default function ImagePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState('server'); // 'server' | 'upload'
  const fileRef = useRef(null);

  const fetchImages = async () => {
    setLoadingImages(true);
    try {
      const res = await api.get('/api/admin/images');
      setImages(res.data?.data || []);
    } catch {
      toast.error('Failed to load images');
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    if (open && tab === 'server') fetchImages();
  }, [open, tab]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await api.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = res.data?.url;
      if (url) {
        onChange(url);
        toast.success('Image uploaded');
        setOpen(false);
        // Refresh server list
        setImages(prev => [{ filename: url.split('/').pop(), url }, ...prev]);
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const selectImage = (url) => {
    onChange(url);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="admin-input flex-1"
          placeholder="https://..."
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-ghost flex items-center gap-2 whitespace-nowrap"
        >
          <FaImage className="text-sm" /> Pick Image
        </button>
      </div>

      {value && (
        <img
          src={value}
          alt="Preview"
          className="h-32 w-full object-cover rounded-lg"
          onError={e => (e.target.style.display = 'none')}
        />
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-white font-semibold text-lg">Select Image</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700">
              {['server', 'upload'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-5 py-2.5 text-sm font-medium transition-colors ${
                    tab === t
                      ? 'text-indigo-400 border-b-2 border-indigo-500'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t === 'server' ? 'Server Images' : 'Upload New'}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {tab === 'server' && (
                <>
                  {loadingImages ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-6 h-6 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                  ) : images.length === 0 ? (
                    <p className="text-slate-400 text-center py-12">No images uploaded yet.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {images.map(img => (
                        <button
                          key={img.filename}
                          type="button"
                          onClick={() => selectImage(img.url)}
                          className={`relative group rounded-lg overflow-hidden border-2 transition-colors ${
                            value === img.url
                              ? 'border-indigo-500'
                              : 'border-transparent hover:border-slate-500'
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.filename}
                            className="w-full h-24 object-cover"
                            onError={e => (e.target.style.display = 'none')}
                          />
                          {value === img.url && (
                            <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                              <FaCheck className="text-indigo-400 text-lg" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {tab === 'upload' && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div
                    className="w-full border-2 border-dashed border-slate-600 hover:border-indigo-500 rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors"
                    onClick={() => fileRef.current?.click()}
                  >
                    <FaUpload className="text-slate-400 text-3xl" />
                    <p className="text-slate-300 text-sm">Click to select an image (max 5 MB)</p>
                    <p className="text-slate-500 text-xs">JPEG, PNG, GIF, WebP, SVG supported</p>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                  />
                  {uploading && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <div className="w-4 h-4 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
                      Uploading…
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
